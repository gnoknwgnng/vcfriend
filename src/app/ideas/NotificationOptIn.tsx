"use client";

import { useState } from "react";
import { Bell, BellOff, CheckCircle, Loader2 } from "lucide-react";
import { savePushSubscription } from "./push-actions";

type Status = "idle" | "loading" | "success" | "denied" | "error" | "unsupported";

interface NotificationOptInProps {
  defaultName?: string;
}

export function NotificationOptIn({ defaultName }: NotificationOptInProps = {}) {
  const [nameOrPhone, setNameOrPhone] = useState(defaultName || "");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleEnable = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!nameOrPhone.trim()) {
      setStatus("error");
      setMessage("Please enter your name or phone number from your pitch submission.");
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      setMessage("Push notifications are not supported in this browser.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // 1. Check VAPID key is available (must be set in env)
      if (!vapidKey) {
        setStatus("error");
        setMessage("Push notifications are not configured on this server yet (VAPID key is missing). Please try again later.");
        return;
      }

      // 2. Ask for browser notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setMessage("Notification permission was denied. You can enable it from your browser settings.");
        return;
      }

      // 3. Register the service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 4. Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const subJson = subscription.toJSON();
      const keys = subJson.keys as { p256dh: string; auth: string };

      // 5. Save subscription to DB linked to their pitch
      const result = await savePushSubscription(nameOrPhone.trim(), {
        endpoint: subscription.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      });

      if (result.error) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(
        `✅ Done! We found ${result.pitchCount} pitch${result.pitchCount !== 1 ? "es" : ""} under "${nameOrPhone.trim()}". You'll get notified when you receive feedback!`
      );
    } catch (err: unknown) {
      console.error("Push subscription error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatus("error");
      setMessage(`Error: ${errMsg}`);
    }
  };

  return (
    <div className="relative p-4 mb-4 rounded-2xl border border-teal/25 bg-teal-light/60">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-teal-deep shrink-0" />
        <span className="text-sm font-semibold text-teal-deep">
          Already pitched? Get notified on feedback
        </span>
      </div>

      {status === "success" ? (
        <div className="flex items-start gap-2 text-teal-deep">
          <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-teal" />
          <p className="text-sm leading-snug">{message}</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameOrPhone}
              onChange={(e) => { setNameOrPhone(e.target.value); setStatus("idle"); setMessage(""); }}
              placeholder="Your name or phone number"
              className="field flex-1 h-10 text-sm"
              disabled={status === "loading"}
              onKeyDown={(e) => e.key === "Enter" && handleEnable()}
            />
            <button
              onClick={handleEnable}
              disabled={status === "loading"}
              className="btn btn-teal btn-sm shrink-0"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {status === "loading" ? "Linking..." : "Allow"}
            </button>
          </div>

          {/* Error / denied message */}
          {(status === "error" || status === "denied" || status === "unsupported") && (
            <p className="mt-2 text-xs font-medium text-coral-deep flex items-start gap-1.5">
              <BellOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// Helper to convert VAPID public key from base64 to Uint8Array<ArrayBuffer>
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  // Use explicit ArrayBuffer so .buffer is typed as ArrayBuffer (not ArrayBufferLike)
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
