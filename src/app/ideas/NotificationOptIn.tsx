"use client";

import { useState } from "react";
import { Bell, BellOff, CheckCircle, Loader2 } from "lucide-react";
import { savePushSubscription } from "./push-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

type Status = "idle" | "loading" | "success" | "denied" | "error" | "unsupported";

export function NotificationOptIn() {
  const [nameOrPhone, setNameOrPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleEnable = async () => {
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
      // 1. Ask for browser notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setMessage("Notification permission was denied. You can enable it from your browser settings.");
        return;
      }

      // 2. Register the service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = subscription.toJSON();
      const keys = subJson.keys as { p256dh: string; auth: string };

      // 4. Save subscription to DB linked to their pitch
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
    } catch (err) {
      console.error("Push subscription error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="relative p-4 mb-5 rounded-sm border-2 border-dashed border-emerald-400 bg-emerald-50/80"
      style={{ fontFamily: "var(--font-caveat), cursive" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
          Already pitched? Get notified on feedback
        </span>
      </div>

      {status === "success" ? (
        <div className="flex items-start gap-2 text-emerald-800">
          <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-[13px] font-semibold leading-snug">{message}</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameOrPhone}
              onChange={(e) => { setNameOrPhone(e.target.value); setStatus("idle"); setMessage(""); }}
              placeholder="Your name or phone number"
              className="flex-1 bg-white border-b-2 border-dashed border-emerald-300 focus:border-emerald-500 placeholder-emerald-400/70 text-slate-900 text-sm font-semibold px-2 py-1.5 focus:outline-none rounded-none"
              disabled={status === "loading"}
              onKeyDown={(e) => e.key === "Enter" && handleEnable()}
            />
            <button
              onClick={handleEnable}
              disabled={status === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.2)] transition-all disabled:opacity-60 shrink-0"
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
            <p className="mt-2 text-[12px] font-semibold text-rose-700 flex items-center gap-1">
              <BellOff className="w-3.5 h-3.5 shrink-0" />
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
