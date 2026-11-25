import "server-only";
import webpush from "web-push";
import { supabase } from "@/lib/supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@vcfriend.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

/**
 * Send a push notification to all subscribers of a given pitch.
 * Lives outside the "use server" files on purpose: it must only ever be
 * called by our own server code, never directly from a browser.
 */
export async function sendPushNotification(
  ideaId: string,
  commenterName: string,
  commentContent: string
): Promise<void> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("[Push Notification] VAPID keys not configured. Skipping push.");
    return;
  }

  const { data: subscriptions, error } = await supabase
    .from("PushSubscription")
    .select("endpoint, p256dh, auth")
    .eq("ideaId", ideaId);

  if (error || !subscriptions || subscriptions.length === 0) {
    return; // No subscribers for this pitch
  }

  const preview = commentContent.length > 80 ? commentContent.substring(0, 80) + "..." : commentContent;

  const payload = JSON.stringify({
    title: "🎉 New feedback on your pitch!",
    body: `${commenterName || "Someone"} said: "${preview}"`,
    url: `/ideas/${ideaId}`,
  });

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === "object" && "statusCode" in err
            ? (err as { statusCode: number }).statusCode
            : undefined;
        // Subscription expired or was revoked: remove it from the DB
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("PushSubscription").delete().eq("endpoint", sub.endpoint);
        } else {
          console.error("[Push Notification] Error sending to subscriber:", err);
        }
      }
    })
  );
}
