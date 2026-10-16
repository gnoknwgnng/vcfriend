import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ChevronLeft, MapPin, Star, Globe, Mail, ShieldCheck, PenLine, Users, Link2 } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

function Stars({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < rating ? "fill-coral text-coral" : "text-line"}`} />
      ))}
    </div>
  );
}

export default async function VCDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams.review === 'success';

  // Fetch the VC by ID
  const { data: vc, error } = await supabase
    .from("VC")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vc) {
    notFound();
  }

  // Fetch the reviews for this VC
  const { data: reviews } = await supabase
    .from("VCReview")
    .select("*")
    .eq("vcId", id)
    .order("createdAt", { ascending: false });

  const websiteHref = vc.website ? (vc.website.startsWith('http') ? vc.website : `https://${vc.website}`) : '#';

  return (
    <div className="flex-1 bg-mist">
      {/* Header band */}
      <div className="bg-white border-b border-line">
        <div className="shell py-10 md:py-14 max-w-5xl animate-fade-in">
          <Link
            href="/vcs"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All firms
          </Link>

          {isSuccess && (
            <div className="notice notice-success mt-6">
              Thank you! Your review for {vc.name} has been published successfully.
            </div>
          )}

          <Reveal className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`tag ${vc.isApproved ? "tag-teal" : "tag-outline"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {vc.isApproved ? "Verified profile" : "Unverified"}
                </span>
                <span className="tag tag-outline">
                  <MapPin className="w-3.5 h-3.5" />
                  {vc.city ? `${vc.city}, ${vc.country}` : (vc.country || "Global")}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-ink leading-[1.02]">{vc.name}</h1>
              <div className="mt-4 flex items-center gap-3">
                {vc.rating ? (
                  <>
                    <Stars rating={Math.round(vc.rating)} size="w-5 h-5" />
                    <span className="font-display text-xl font-semibold text-ink">{vc.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      from {reviews?.length || 0} founder review{(reviews?.length || 0) === 1 ? "" : "s"}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No ratings yet</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href={websiteHref} target="_blank" className="btn btn-ghost">
                <Globe className="w-4 h-4" /> Visit website
              </Link>
              <Link href={`/vcs/${id}/review`} className="btn btn-coral">
                <PenLine className="w-4 h-4" /> Write a review
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="shell py-10 md:py-14 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left: About & Reviews */}
          <RevealGroup className="lg:col-span-2 space-y-6" stagger={0.12}>
            <section className="surface p-7 md:p-8">
              <h2 className="text-2xl font-semibold text-ink">About {vc.name}</h2>
              <h3 className="mt-6 text-sm font-semibold text-ink-soft">Investment thesis & description</h3>
              <p className="mt-2 text-[15px] md:text-base leading-relaxed text-ink-soft break-words [overflow-wrap:anywhere]">
                {vc.description || vc.investmentThesis || "No detailed description provided."}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-line">
                <div>
                  <dt className="text-sm text-muted-foreground">Check size</dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-ink">
                    {vc.minCheck || vc.maxCheck
                      ? `${vc.minCheck ? `$${Number(vc.minCheck).toLocaleString()}` : '...'} – ${vc.maxCheck ? `$${Number(vc.maxCheck).toLocaleString()}` : '...'}`
                      : "Not disclosed"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Verified status</dt>
                  <dd className="mt-1">
                    <span className={`tag ${vc.isApproved ? "tag-teal" : "tag-neutral"}`}>
                      {vc.isApproved ? "Verified profile" : "Unverified"}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            <section className="surface p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">Founder reviews</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Read authentic experiences from founders.</p>
                </div>
                {reviews && reviews.length > 0 && (
                  <Link href={`/vcs/${id}/review`} className="btn btn-ghost btn-sm shrink-0">
                    <PenLine className="w-4 h-4" /> Write review
                  </Link>
                )}
              </div>

              {!reviews || reviews.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-line bg-mist p-8 text-center">
                  <p className="font-medium text-ink">No reviews have been submitted yet.</p>
                  <p className="mt-1 text-sm text-ink-soft">Met this firm? Help the next founder.</p>
                  <Link href={`/vcs/${id}/review`} className="btn btn-teal btn-sm mt-5">
                    Be the first to review
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-line">
                  {reviews.map((review) => (
                    <li key={review.id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-lavender-light text-[#5e4580] flex items-center justify-center font-semibold text-xs shrink-0">
                            {(review.authorName?.[0] || 'A').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink truncate">{review.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{review.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </RevealGroup>

          {/* Right: Contact & Team */}
          <RevealGroup as="section" className="space-y-6" stagger={0.12} delay={0.15} effect="slide-right">
            <section className="surface p-7">
              <h2 className="text-xl font-semibold text-ink">Contact</h2>
              <div className="mt-5 space-y-3">
                {vc.email ? (
                  <a href={`mailto:${vc.email}`} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 hover:bg-mist transition-colors">
                    <Mail className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-sm font-medium text-ink truncate">{vc.email}</span>
                  </a>
                ) : null}

                {vc.linkedin ? (
                  <a href={vc.linkedin.startsWith('http') ? vc.linkedin : `https://${vc.linkedin}`} target="_blank" className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 hover:bg-mist transition-colors">
                    <Link2 className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-sm font-medium text-ink">LinkedIn profile</span>
                  </a>
                ) : null}

                {vc.twitter ? (
                  <a href={vc.twitter.startsWith('http') ? vc.twitter : `https://${vc.twitter}`} target="_blank" className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 hover:bg-mist transition-colors">
                    <Link2 className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-sm font-medium text-ink">Twitter (X)</span>
                  </a>
                ) : null}

                {!vc.email && !vc.linkedin && !vc.twitter && (
                  <p className="text-sm text-muted-foreground">No contact information available.</p>
                )}
              </div>
            </section>

            <section className="surface p-7">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal" />
                <h2 className="text-xl font-semibold text-ink">Team</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">No team members listed yet.</p>
            </section>
          </RevealGroup>

        </div>
      </div>
    </div>
  );
}
