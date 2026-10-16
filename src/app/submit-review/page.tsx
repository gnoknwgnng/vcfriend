"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, PenLine } from "lucide-react";
import { submitTestimonial } from "./actions";

export default function SubmitReviewPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await submitTestimonial(formData);
    setIsLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-16 max-w-3xl animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to home
        </Link>

        <form onSubmit={handleSubmit} className="mt-6 surface overflow-hidden">
          <div className="p-7 md:p-10 border-b border-line">
            <div className="w-12 h-12 rounded-2xl bg-coral-light text-coral-deep flex items-center justify-center mb-5">
              <PenLine className="w-5.5 h-5.5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink leading-tight">Write a review</h1>
            <p className="mt-2 text-base md:text-lg text-ink-soft">
              Did VC Friend help you navigate the fundraising landscape? Share your experience with the community!
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
                placeholder="How did VC Friend help you? What did you like about it?"
                className="field min-h-[160px]"
                required
              />
            </div>
          </div>

          <div className="px-7 md:px-10 py-6 bg-mist/70 border-t border-line flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link href="/" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="btn btn-coral">
              {isLoading ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
