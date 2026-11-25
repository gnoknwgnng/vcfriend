"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Send } from "lucide-react";
import { submitIdeaComment } from "../actions";

interface CommentFormProps {
  ideaId: string;
}

export function CommentForm({ ideaId }: CommentFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // React clears e.currentTarget once the handler yields, so keep the form now.
    const form = e.currentTarget;
    setIsLoading(true);
    setErrorMsg(null);
    setIsPosted(false);
    const formData = new FormData(form);

    try {
      const res = await submitIdeaComment(ideaId, formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        form.reset();
        setIsPosted(true);
        router.refresh();
      }
    } catch {
      setErrorMsg("Something went wrong while posting. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
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

      {isPosted && (
        <div className="notice notice-success mt-4" role="status">
          Thanks! Your feedback has been posted.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          name="authorName"
          placeholder="Your name (optional)"
          className="field"
          maxLength={80}
        />
        <textarea
          name="content"
          placeholder="What do you think about this idea? How can it be improved?"
          className="field min-h-[120px]"
          maxLength={2000}
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
