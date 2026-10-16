import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { ChevronLeft, Phone, BadgeCheck, MessageSquareQuote } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";

export const revalidate = 0; // Dynamic route

export default async function IdeaThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch the idea
  const { data: idea, error: ideaError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt, contactInfo")
    .eq("id", id)
    .single();

  if (ideaError || !idea) {
    notFound();
  }

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from("IdeaComment")
    .select("*")
    .eq("ideaId", id)
    .order("createdAt", { ascending: true });

  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
  }

  const name = idea.authorName || "Anonymous Founder";

  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-14 max-w-3xl animate-fade-in">

        <Link
          href="/ideas"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to global feed
        </Link>

        {/* Main Idea Pitch */}
        <Reveal as="article" effect="scale" className="mt-6 surface p-7 md:p-9">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-light text-teal-deep flex items-center justify-center font-semibold text-base shrink-0">
              {(idea.authorName?.[0] || 'A').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-ink leading-tight truncate">{name}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Pitched {idea.createdAt ? formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true }) : 'Just now'}
              </div>
            </div>
            {idea.contactInfo && (
              <span className="tag tag-outline shrink-0 hidden sm:inline-flex">
                <Phone className="w-3.5 h-3.5" /> {idea.contactInfo}
              </span>
            )}
          </div>

          {idea.contactInfo && (
            <span className="tag tag-outline mt-4 sm:hidden">
              <Phone className="w-3.5 h-3.5" /> {idea.contactInfo}
            </span>
          )}

          <div className="mt-6 text-base md:text-lg leading-relaxed text-ink">
            <LinkifyText text={idea.content} />
          </div>
        </Reveal>

        {/* Comments Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-teal" />
            <h2 className="text-2xl font-semibold text-ink">Discussion & feedback</h2>
            <span className="ml-1 text-sm text-muted-foreground tabular-nums">({comments?.length || 0})</span>
          </div>

          {/* Comments List */}
          <RevealGroup className="space-y-4" stagger={0.1}>
            {!comments || comments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white/60 py-12 px-6 text-center">
                <p className="font-medium text-ink">No feedback yet.</p>
                <p className="mt-1 text-sm text-ink-soft">Be the first to review this idea below.</p>
              </div>
            ) : (
              comments.map((comment) => {
                const isVC = comment.isVC;
                return (
                  <div
                    key={comment.id}
                    className={`relative rounded-2xl border p-6 ${
                      isVC
                        ? "border-teal/40 bg-teal-light/60 shadow-[0_12px_32px_-20px_rgba(31,95,107,0.5)]"
                        : "surface"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${
                          isVC ? "bg-teal text-white" : "bg-lavender-light text-[#5e4580]"
                        }`}>
                          {(comment.authorName?.[0] || 'A').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className={`font-semibold text-sm truncate ${isVC ? "text-teal-deep" : "text-ink"}`}>
                            {comment.authorName || "Anonymous Reviewer"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                          </div>
                        </div>
                      </div>
                      {isVC && (
                        <span className="tag bg-teal text-white">
                          <BadgeCheck className="w-3.5 h-3.5" /> Verified VC review
                        </span>
                      )}
                    </div>

                    <p className={`mt-4 text-[15px] leading-relaxed ${isVC ? "text-teal-deep font-medium" : "text-ink-soft"}`}>
                      {comment.content}
                    </p>
                  </div>
                );
              })
            )}
          </RevealGroup>

          {/* Add Comment Form */}
          <Reveal delay={0.1}><CommentForm ideaId={id} /></Reveal>
        </div>

      </div>
    </div>
  );
}
