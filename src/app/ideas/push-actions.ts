"use server";

import { supabase } from "@/lib/supabase";
import webpush from "web-push";
import { headers } from "next/headers";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@vcfriend.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

/**
 * Save a push subscription linked to a pitch (found by authorName or phone).
 * Also captures and stores the requester's IP on the matched pitch rows.
 */
export async function savePushSubscription(
  nameOrPhone: string,
  subscription: { endpoint: string; p256dh: string; auth: string }
) {
  if (!nameOrPhone || nameOrPhone.trim() === "") {
    return { error: "Please enter your name or phone number used when submitting your pitch." };
  }

  const query = nameOrPhone.trim();

  // Capture the visitor's IP address from request headers
  let ip: string | null = null;
  try {
    const headersList = await headers();
    const rawIp =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      null;
    ip = rawIp ? rawIp.split(",")[0].trim() : null;
  } catch (e) {
    console.error("Failed to read IP from headers:", e);
  }

  // Search by authorName (case-insensitive) OR contactInfo (phone number)
  const { data: pitches, error: pitchError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, ipAddress")
    .or(`authorName.ilike.${query},contactInfo.eq.${query}`);

  if (pitchError || !pitches || pitches.length === 0) {
    return { error: "We couldn't find a pitch with that name or phone number. Please check and try again." };
  }

  // Update ipAddress on pitches that don't already have one
  if (ip) {
    const pitchIdsWithoutIp = pitches
      .filter((p) => !p.ipAddress)
      .map((p) => p.id);

    if (pitchIdsWithoutIp.length > 0) {
      const { error: updateError } = await supabase
        .from("IdeaPitch")
        .update({ ipAddress: ip })
        .in("id", pitchIdsWithoutIp);

      if (updateError) {
        console.error("Failed to update ipAddress on pitch:", updateError);
      } else {
        console.log(
          `[Push] Updated ipAddress (${ip}) on ${pitchIdsWithoutIp.length} pitch(es) for "${query}"`
        );
      }
    }
  }

  // Save push subscriptions for all matching pitches
  const subscriptionsToInsert = pitches.map((p) => ({
    ideaId: p.id,
    endpoint: subscription.endpoint,
    p256dh: subscription.p256dh,
    auth: subscription.auth,
  }));

  const { error: insertError } = await supabase
    .from("PushSubscription")
    .upsert(subscriptionsToInsert, { onConflict: "endpoint,ideaId" });

  if (insertError) {
    console.error("Error saving push subscription:", insertError);
    // If table doesn't exist yet, still return success to not break UX
    return { success: true, pitchCount: pitches.length, tableWarning: true };
  }

  return { success: true, pitchCount: pitches.length };
}


/**
 * Send a push notification to all subscribers of a given pitch.
 */
export async function sendPushNotification(
  ideaId: string,
  commenterName: string,
  commentContent: string
) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("[Push Notification] VAPID keys not configured. Skipping push.");
    return;
  }

  // Fetch the pitch info
  const { data: idea } = await supabase
    .from("IdeaPitch")
    .select("authorName")
    .eq("id", ideaId)
    .single();

  // Fetch all subscriptions for this pitch
  const { data: subscriptions, error } = await supabase
    .from("PushSubscription")
    .select("endpoint, p256dh, auth")
    .eq("ideaId", ideaId);

  if (error || !subscriptions || subscriptions.length === 0) {
    return; // No subscribers for this pitch
  }

  const founderName = idea?.authorName || "Founder";
  const preview = commentContent.length > 80 ? commentContent.substring(0, 80) + "..." : commentContent;

  const payload = JSON.stringify({
    title: `🎉 New feedback on your pitch!`,
    body: `${commenterName || "Someone"} said: "${preview}"`,
    url: `/ideas/${ideaId}`,
  });

  // Send to all subscribers
  const sendPromises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      );
    } catch (err: unknown) {
      // If subscription expired (410), remove it from DB
      if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
        await supabase
          .from("PushSubscription")
          .delete()
          .eq("endpoint", sub.endpoint);
      } else {
        console.error("[Push Notification] Error sending to subscriber:", err);
      }
    }
  });

  await Promise.allSettled(sendPromises);
}
