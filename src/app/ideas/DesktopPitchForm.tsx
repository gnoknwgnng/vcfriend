"use client";

import { useState } from "react";
import { Lightbulb, Rocket, AlertTriangle } from "lucide-react";
import { submitIdea } from "./actions";
import { NotificationOptIn } from "./NotificationOptIn";

export function DesktopPitchForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const authorName = formData.get("authorName") as string;
    const res = await submitIdea(formData);
    setIsLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSubmittedName(authorName || "");
      setIsSuccess(true);
      e.currentTarget.reset();
    }
  };

  if (isSuccess) {
    return (
      <div className="surface p-6">
        <div className="text-center py-2 space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-teal-light text-teal-deep flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-ink">Pitch submitted</h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Your startup idea is now live in the global feed.
          </p>
        </div>

        <div className="border-t border-line my-5" />

        <NotificationOptIn defaultName={submittedName} />

        <button
          onClick={() => {
            setIsSuccess(false);
            window.location.href = "/ideas";
          }}
          className="btn btn-ink w-full mt-2"
        >
          Back to feed
        </button>
      </div>
    );
  }

  return (
    <div className="surface p-6">
      <div className="flex items-start gap-3 pb-5 mb-5 border-b border-line">
        <div className="w-10 h-10 rounded-xl bg-coral-light text-coral-deep flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink leading-tight">Pitch your idea</h2>
          <p className="text-sm text-muted-foreground mt-0.5">What are you building?</p>
        </div>
      </div>

      {/* Already-pitched notification opt-in */}
      <NotificationOptIn />

      {/* Anti-Abuse Warning Notice */}
      <div className="notice notice-warn mb-4 flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Please do not misuse this platform. Spammers&apos; IP addresses are logged, and invalid submissions are blocked by AI automatically.</span>
      </div>

      {errorMsg && (
        <div className="notice notice-error mb-4" role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="authorName"
          placeholder="Your name (optional)"
          className="field"
        />
        <input
          name="contactInfo"
          placeholder="Contact info (optional)"
          className="field"
          type="tel"
        />
        <textarea
          name="content"
          placeholder="I am building a platform that helps..."
          className="field min-h-[150px]"
          required
        />
        <button type="submit" disabled={isLoading} className="btn btn-coral w-full mt-1">
          <Rocket className="w-4 h-4" />
          {isLoading ? "Submitting..." : "Submit pitch"}
        </button>
      </form>
    </div>
  );
}
