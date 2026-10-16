"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { submitVCReview } from "./actions";

interface VCReviewFormProps {
  vcId: string;
  vcName: string;
}

export function VCReviewForm({ vcId, vcName }: VCReviewFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await submitVCReview(formData, vcId);
    setIsLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <>
      <Link
        href={`/vcs/${vcId}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to {vcName}
      </Link>

      <form onSubmit={handleSubmit} className="mt-6 surface overflow-hidden">
        <div className="p-7 md:p-10 border-b border-line">
          <div className="w-12 h-12 rounded-2xl bg-coral-light text-coral-deep flex items-center justify-center mb-5">
            <Star className="w-5.5 h-5.5 fill-coral-deep" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink leading-tight">Review {vcName}</h1>
          <p className="mt-2 text-base md:text-lg text-ink-soft">
            Share your fundraising or meeting experience with this firm to help other founders.
          </p>
        </div>

        <div className="p-7 md:p-10 space-y-6">
          {errorMsg && (
            <div className="notice notice-error" role="alert">
              {errorMsg}
            </div>
          )}

          <div>
            <label htmlFor="authorName" className="field-label">Your name & company (optional)</label>
            <input
              id="authorName"
              name="authorName"
              placeholder="e.g. Jane Doe, Founder @ StartupX"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="rating" className="field-label">Rating</label>
            <select id="rating" name="rating" className="field" defaultValue="5">
              <option value="5">⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
              <option value="4">⭐⭐⭐⭐ (4/5) - Great</option>
              <option value="3">⭐⭐⭐ (3/5) - Good</option>
              <option value="2">⭐⭐ (2/5) - Fair</option>
              <option value="1">⭐ (1/5) - Poor</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="field-label">Your review</label>
            <textarea
              id="content"
              name="content"
              placeholder="How was your interaction? Were they helpful? Did they invest?"
              className="field min-h-[160px]"
              required
            />
          </div>
        </div>

        <div className="px-7 md:px-10 py-6 bg-mist/70 border-t border-line flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Link href={`/vcs/${vcId}`} className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="btn btn-coral">
            {isLoading ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </form>
    </>
  );
}
