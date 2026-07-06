"use server";

import { supabase } from "@/lib/supabase";
import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@vcfriend.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

/**
 * Save a push subscription linked to a pitch (found by authorName).
 * Returns the ideaIds that were matched.
 */
export async function savePushSubscription(
  authorName: string,
  subscription: { endpoint: string; p256dh: string; auth: string }
) {
  if (!authorName || authorName.trim() === "") {
    return { error: "Please enter your name to link your pitch." };
  }

  // Find pitches by this author name (case-insensitive)
  const { data: pitches, error: pitchError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName")
    .ilike("authorName", authorName.trim());

  if (pitchError || !pitches || pitches.length === 0) {
    return { error: "We couldn't find a pitch submitted under that name. Please check and try again." };
  }

  // Save subscription for all matching pitches
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
