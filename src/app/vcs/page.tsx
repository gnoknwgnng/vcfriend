import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { MapPin, Star, Wallet, ArrowRight, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Venture Capital Directory & Fundraiser Search - VC Friend",
  description: "Browse active venture capital firms, filter investors by investment stage and sector focus, and accelerate your startup fundraising campaign.",
};

export default async function VCDirectory({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const stage = params?.stage as string;
  const sector = params?.sector as string;
  const pageStr = params?.page as string;

  const page = parseInt(pageStr) || 1;
  const limit = 18; // Multi-column grid optimized limit
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from('VC')
    .select('*', { count: 'exact' })
    .order('createdAt', { ascending: false });

  if (stage) {
    query = query.ilike('description', `%${stage}%`);
  }

  if (sector && sector !== 'All Sectors') {
    query = query.ilike('sector', `%${sector}%`);
  }

  const { data: vcs, error, count } = await query.range(start, end);

  if (error) {
    console.error("Error fetching VCs:", error);
  }

  const displayVCs = vcs || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const pageHref = (p: number) =>
    `/vcs?page=${p}${stage ? `&stage=${stage}` : ''}${sector ? `&sector=${sector}` : ''}`;

  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-14 flex flex-col gap-8 animate-fade-in">

        {/* Header */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]">
              Active venture capital firms
            </h1>
            <p className="mt-3 text-base md:text-lg text-ink-soft">
              Showing {displayVCs.length} of {totalCount.toLocaleString()} investors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stage && <span className="tag tag-teal">Stage: {stage}</span>}
            {sector && sector !== 'All Sectors' && <span className="tag tag-lavender">Sector: {sector}</span>}
            <Link href="/onboarding" className="btn btn-ghost btn-sm">
              <SlidersHorizontal className="w-4 h-4" />
              {stage || sector ? "Change filters" : "Filter by stage & sector"}
            </Link>
          </div>
        </Reveal>

        {/* VC Grid */}
        {displayVCs.length === 0 ? (
          <Reveal effect="scale" className="surface text-center py-16 px-6">
            <p className="text-lg font-medium text-ink">No firms match these filters.</p>
            <p className="mt-1 text-ink-soft">Try a broader stage or sector.</p>
            <Link href="/vcs" className="btn btn-ghost btn-sm mt-6">Show all firms</Link>
          </Reveal>
        ) : (
          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" stagger={0.06}>
            {displayVCs.map((vc) => (
              <article
                key={vc.id}
                className="surface surface-hover p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold text-ink leading-tight">
                      <Link href={`/vcs/${vc.id}`} className="hover:text-teal transition-colors">
                        {vc.name}
                      </Link>
                    </h3>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {vc.city ? `${vc.city}, ${vc.country}` : (vc.country || "Global")}
                    </p>
                  </div>
                  <span className={`tag shrink-0 ${vc.rating ? "tag-coral" : "tag-outline"}`}>
                    <Star className={`w-3.5 h-3.5 ${vc.rating ? "fill-coral-deep" : ""}`} />
                    {vc.rating ? vc.rating.toFixed(1) : "New"}
                  </span>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft line-clamp-3 flex-1 break-words [overflow-wrap:anywhere]">
                  {vc.description || vc.investmentThesis || "No description provided."}
                </p>

                {(vc.minCheck || vc.maxCheck) && (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-ink">
                    <Wallet className="w-4 h-4 text-teal" />
                    <span className="font-medium">
                      {vc.minCheck ? `$${Number(vc.minCheck).toLocaleString()}` : '...'} – {vc.maxCheck ? `$${Number(vc.maxCheck).toLocaleString()}` : '...'}
                    </span>
                    <span className="text-muted-foreground">check size</span>
                  </div>
                )}

                <div className="mt-5 pt-5 border-t border-line flex gap-2">
                  <Link href={`/vcs/${vc.id}`} className="btn btn-sm btn-ink flex-1">
                    View profile <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href={`/vcs/${vc.id}/review`} className="btn btn-sm btn-ghost flex-1">
                    Write a review
                  </Link>
                </div>
              </article>
            ))}
          </RevealGroup>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-3 mt-4 pt-8 border-t border-line" aria-label="Pagination">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="btn btn-ghost btn-sm">
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
              <Link href={pageHref(page + 1)} className="btn btn-ghost btn-sm">
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
    </div>
  );
}
