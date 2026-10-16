"use client";

import { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { submitIdeaComment } from "../actions";

interface CommentFormProps {
  ideaId: string;
}

export function CommentForm({ ideaId }: CommentFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await submitIdeaComment(ideaId, formData);
    setIsLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      e.currentTarget.reset();
      window.location.reload();
    }
  };

  return (
    <div className="surface p-6 md:p-7 mt-8">
      <h2 className="text-xl font-semibold text-ink">Leave feedback</h2>
      <p className="mt-1 text-sm text-muted-foreground">Constructive, specific notes help the founder most.</p>

      {/* Anti-Abuse Warning Notice */}
      <div className="notice notice-warn mt-5 flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Please do not misuse this platform. Duplicate replies or spam content are blocked automatically.</span>
      </div>

      {errorMsg && (
        <div className="notice notice-error mt-4" role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          name="authorName"
          placeholder="Your name (optional)"
          className="field"
        />
        <textarea
          name="content"
          placeholder="What do you think about this idea? How can it be improved?"
          className="field min-h-[120px]"
          required
        />
        <div className="flex justify-end pt-1">
          <button type="submit" disabled={isLoading} className="btn btn-coral">
            <Send className="w-4 h-4" />
            {isLoading ? "Posting..." : "Post feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
