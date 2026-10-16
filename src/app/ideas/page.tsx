import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Flame, Phone } from "lucide-react";
import { MobilePitchModal } from "./MobilePitchModal";
import { DesktopPitchForm } from "./DesktopPitchForm";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";

export const metadata = {
  title: "Startup Pitch & Fundraiser Ideas Feed - VC Friend",
  description: "Browse community startup pitches, share your fundraiser concepts anonymously, and get constructive feedback from verified investors and founders.",
};

export default async function IdeaFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const pageStr = params?.page as string;
  const page = parseInt(pageStr) || 1;
  const limit = 12; // Snappy feed page limit
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Fetch ideas from Supabase
  const { data: ideas, error, count } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt, contactInfo, IdeaComment(isVC)", { count: 'exact' })
    .order("createdAt", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching ideas:", error);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <div className="flex-1 bg-mist">
        <div className="shell py-10 md:py-14 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to home
          </Link>

          <Reveal className="mt-6 mb-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]">Community pitches</h1>
            <p className="mt-3 text-base md:text-lg text-ink-soft">
              Explore startup ideas or drop your own to get instant feedback.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Idea Feed (Top on mobile, Left on desktop) */}
            <div className="lg:col-span-2 order-1">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xl font-semibold text-ink">Recent pitches</h2>
                <span className="text-sm text-muted-foreground tabular-nums">{totalCount.toLocaleString()} total</span>
              </div>

              {!ideas || ideas.length === 0 ? (
                <div className="surface text-center py-16 px-6">
                  <p className="text-lg font-medium text-ink">No ideas pitched yet.</p>
                  <p className="mt-1 text-ink-soft">Be the first — the form is right here.</p>
                </div>
              ) : (
                <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start" stagger={0.07}>
                  {ideas.map((idea) => {
                    const hasVCReview = Array.isArray(idea.IdeaComment) && idea.IdeaComment.some((comment: any) => comment.isVC);
                    const name = idea.authorName || "Anonymous Founder";
                    return (
                      <article key={idea.id} className="surface surface-hover p-6 flex flex-col">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-teal-light text-teal-deep flex items-center justify-center font-semibold text-sm shrink-0">
                              {(idea.authorName?.[0] || 'A').toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-ink truncate">{name}</div>
                              <div className="text-xs text-muted-foreground">
                                {idea.createdAt ? formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true }) : 'Just now'}
                              </div>
                            </div>
                          </div>
                          {hasVCReview && (
                            <span className="tag tag-coral shrink-0">
                              <Flame className="w-3.5 h-3.5" /> VC reviewed
                            </span>
                          )}
                        </div>

                        {idea.contactInfo && (
                          <span className="tag tag-outline self-start mt-4">
                            <Phone className="w-3.5 h-3.5" /> {idea.contactInfo}
                          </span>
                        )}

                        <div className="mt-4 text-[15px] leading-relaxed text-ink-soft flex-1">
                          <LinkifyText text={idea.content} />
                        </div>

                        <Link
                          href={`/ideas/${idea.id}`}
                          className="mt-5 pt-4 border-t border-line inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-coral transition-colors"
                        >
                          <MessageSquareQuote className="w-4 h-4" />
                          View feedback & discuss
                        </Link>
                      </article>
                    );
                  })}
                </RevealGroup>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-3 mt-10 pt-8 border-t border-line" aria-label="Pagination">
                  {page > 1 ? (
                    <Link href={`/ideas?page=${page - 1}`} className="btn btn-ghost btn-sm">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Link>
                  ) : (
                    <span className="btn btn-ghost btn-sm opacity-40 pointer-events-none">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </span>
                  )}

                  <span className="text-sm font-medium text-ink-soft px-3 tabular-nums">
                    Page {page} of {totalPages}
                  </span>

                  {page < totalPages ? (
                    <Link href={`/ideas?page=${page + 1}`} className="btn btn-ghost btn-sm">
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="btn btn-ghost btn-sm opacity-40 pointer-events-none">
                      Next <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </nav>
              )}
            </div>

            {/* Submit Idea Form (Desktop only) */}
            <Reveal effect="slide-right" delay={0.2} className="hidden lg:block lg:col-span-1 order-2 lg:sticky lg:top-24 lg:self-start">
              <div id="pitch-form"><DesktopPitchForm /></div>
            </Reveal>
          </div>
        </div>
      </div>

      <MobilePitchModal />
    </>
  );
}
