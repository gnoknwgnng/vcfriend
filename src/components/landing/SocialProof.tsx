"use client";

import { CountUp, Parallax, Reveal, RevealGroup, SplitWords } from "@/components/ui/Reveal";
import Link from "next/link";
import { ArrowRight, MessageSquareQuote, Flame, Star, PenLine } from "lucide-react";

interface SocialProofProps {
  testimonials: any[];
  latestIdeas: any[];
  reviewsCount: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, j) => (
        <Star
          key={j}
          className={`w-4 h-4 ${j < rating ? "fill-coral text-coral" : "text-line fill-none"}`}
        />
      ))}
    </div>
  );
}

export function SocialProof({ testimonials, latestIdeas, reviewsCount }: SocialProofProps) {
  return (
    <>
      {/* Latest pitches */}
      <section className="w-full py-20 md:py-28 bg-mist">
        <div className="shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div className="max-w-xl">
              <SplitWords
                text="Recent community pitches"
                className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]"
              />
              <Reveal delay={0.15}>
                <p className="mt-3 text-lg text-ink-soft">See what other founders are building right now.</p>
              </Reveal>
            </div>
            <Reveal effect="fade" delay={0.3}>
              <Link href="/ideas" className="btn btn-ghost btn-sm self-start md:self-auto">
                View all pitches <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-5" stagger={0.1}>
            {!latestIdeas || latestIdeas.length === 0 ? (
              <div className="col-span-3 surface text-center py-14 text-ink-soft">
                No pitches yet. <Link href="/ideas" className="text-teal font-semibold hover:underline">Post the first one.</Link>
              </div>
            ) : (
              latestIdeas.map((idea, index) => {
                const hasVCReview =
                  Array.isArray(idea.IdeaComment) && idea.IdeaComment.some((comment: any) => comment.isVC);
                const name =
                  idea.authorName && idea.authorName.trim() !== "" ? idea.authorName : "Anonymous Founder";
                return (
                  <article
                    key={idea.id}
                    className="surface surface-hover p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-teal-light text-teal-deep flex items-center justify-center font-semibold text-sm shrink-0">
                          {name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-ink truncate">{name}</div>
                          <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {hasVCReview && (
                        <span className="tag tag-coral shrink-0">
                          <Flame className="w-3.5 h-3.5" /> VC reviewed
                        </span>
                      )}
                    </div>

                    <p className="text-[15px] leading-relaxed text-ink-soft flex-1">
                      {idea.content?.length > 180 ? idea.content.slice(0, 180) + "…" : idea.content}
                    </p>

                    <Link
                      href={`/ideas/${idea.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-coral transition-colors"
                    >
                      <MessageSquareQuote className="w-4 h-4" />
                      Read the discussion
                    </Link>
                  </article>
                );
              })
            )}
          </RevealGroup>
        </div>
      </section>

      {/* Free-forever note */}
      <section className="w-full bg-white border-y border-line">
        <div className="shell py-16 md:py-20">
          <Reveal effect="scale" amount={0.3} className="relative overflow-hidden rounded-3xl ink-panel p-8 md:p-14">
            <Parallax speed={-0.1} className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-20 dot-grid" />
            </Parallax>
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-8">
                <span className="tag bg-white/10 text-white border-white/15">Community note</span>
                <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white leading-[1.05]">
                  VC Friend will always be free.
                </h2>
                <p className="mt-5 text-base md:text-lg leading-relaxed text-white/75 max-w-2xl">
                  We believe fundraising should be transparent and accessible to every founder. We
                  never charge founders to discover investors. If this platform helped you, the best
                  way to support us is by sharing your experience.
                </p>
                <Link href="/submit-review" className="btn btn-coral mt-8">
                  <PenLine className="w-4 h-4" />
                  Write a platform review
                </Link>
              </div>
              <div className="md:col-span-4 hidden md:flex justify-end">
                <Parallax speed={0.25}>
                  <div className="w-44 h-44 rounded-full border border-white/15 bg-white/5 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-5xl font-bold text-white">₹0</span>
                    <span className="text-sm text-white/60 mt-1">for founders, forever</span>
                  </div>
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 md:py-28 bg-mist">
        <div className="shell">
          <div className="max-w-xl mb-10">
            <SplitWords text="Loved by founders" className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]" />
            <Reveal delay={0.15}>
              <p className="mt-3 text-lg text-ink-soft">
                See what other entrepreneurs are saying about their experience using VC Friend.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.08} effect="scale">
            {!testimonials || testimonials.length === 0 ? (
              <div className="col-span-full surface text-center py-14 text-ink-soft">
                No reviews yet.{" "}
                <Link href="/submit-review" className="text-teal font-semibold hover:underline">
                  Be the first to share your experience.
                </Link>
              </div>
            ) : (
              testimonials.map((review, index) => (
                <figure
                  key={review.id}
                  className="surface surface-hover p-6 flex flex-col"
                >
                  <Stars rating={review.rating} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
                    “{review.content}”
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-line flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-lavender-light text-[#5e4580] flex items-center justify-center font-semibold text-xs">
                      {(review.authorName?.[0] || "A").toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-ink-soft">
                      {review.authorName || "Anonymous Founder"}
                    </span>
                  </figcaption>
                </figure>
              ))
            )}
          </RevealGroup>
        </div>
      </section>

      {/* Statistics */}
      <section className="w-full bg-white border-y border-line">
        <div className="shell py-14 md:py-16">
          <RevealGroup as="div" className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 md:divide-x md:divide-line" stagger={0.12} effect="fade">
            {[
              { stat: "2,000+", label: "VC firms" },
              { stat: reviewsCount.toString(), label: "Founder reviews" },
              { stat: "120+", label: "Industries" },
              { stat: "40+", label: "Countries" },
            ].map((item) => (
              <div key={item.label} className="md:px-6 first:md:pl-0">
                <div className="font-display text-4xl md:text-5xl font-bold text-ink"><CountUp value={item.stat} duration={1.8} /></div>
                <div className="mt-1 text-sm md:text-base text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
