"use client";

import { useState } from "react";
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
      <div 
        className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-[6px_6px_24px_rgba(0,0,0,0.28)] rotate-1"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        {/* Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 shadow-md border-2 border-white/80 z-10" />
        {/* Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
        {/* Lined paper texture */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
            backgroundPositionY: "44px",
          }}
        />

        <div className="mt-3 text-center py-4 space-y-4 relative z-10">
          <div className="text-4xl">🚀</div>
          <h2 className="text-3xl font-bold text-slate-900">Pitch Submitted!</h2>
          <p className="text-base text-slate-700 leading-relaxed font-semibold">
            Your startup idea is now live in the global feed.
          </p>

          <div className="border-b-2 border-dashed border-slate-200 my-4" />

          <div className="text-left">
            <NotificationOptIn defaultName={submittedName} />
          </div>

          <button 
            onClick={() => {
              setIsSuccess(false);
              window.location.href = "/ideas";
            }}
            className="w-full mt-4 inline-flex items-center justify-center px-6 h-12 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-[6px_6px_24px_rgba(0,0,0,0.28)] rotate-1"
      style={{ fontFamily: "var(--font-caveat), cursive" }}
    >
      {/* Pin */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 shadow-md border-2 border-white/80 z-10" />
      {/* Tape */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
      {/* Lined paper texture */}
      <div
        className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
          backgroundPositionY: "44px",
        }}
      />

      <div className="mt-3 border-b-2 border-dashed border-slate-200 pb-3 mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Pitch Your Idea</h2>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1">What are you building?</p>
      </div>

      {/* Already-pitched notification opt-in */}
      <NotificationOptIn />

      {/* Anti-Abuse Warning Notice */}
      <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-sm text-[12px] text-red-700 leading-normal font-bold">
        ⚠️ Please do not misuse this platform. Spammers' IP addresses are logged, and invalid submissions are blocked by AI automatically.
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-rose-100 border border-rose-300 rounded-sm text-[13px] text-rose-800 font-bold leading-normal">
          ❌ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <input 
            name="authorName" 
            placeholder="Your Name (Optional)" 
            className="w-full bg-transparent border-b-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold px-1 py-1.5 focus:outline-none"
          />
          <input 
            name="contactInfo" 
            placeholder="Contact Info (Optional)" 
            className="w-full bg-transparent border-b-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold px-1 py-1.5 focus:outline-none"
            type="tel"
          />
        </div>
        <div className="space-y-2">
          <textarea 
            name="content" 
            placeholder="I am building a platform that helps..." 
            className="w-full min-h-[140px] bg-transparent border-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold p-2.5 focus:outline-none resize-none rounded-sm"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-2 inline-flex items-center justify-center px-6 h-12 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "🚀 Submit Pitch"}
        </button>
      </form>
    </div>
  );
}
