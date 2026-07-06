import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { ChevronLeft, MessageSquareQuote } from "lucide-react";
import { MobilePitchModal } from "./MobilePitchModal";
import { DesktopPitchForm } from "./DesktopPitchForm";

export const revalidate = 0; // Dynamic route

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

  const PITCH_COLORS = [
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.5deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.6deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.4deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
        <div className="mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          <Link 
            href="/" 
            className="inline-flex items-center text-lg font-bold text-emerald-200 hover:text-emerald-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
          </Link>
        </div>
        
        <div className="mb-12 text-center lg:text-left">
          <h1 className="chalk-heading text-4xl md:text-5xl font-bold tracking-tight mb-2">Community Pitches</h1>
          <p className="chalk-text text-xl">Explore startup ideas or drop your own to get instant feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Idea Feed (Top on mobile, Left on desktop) */}
          <div className="lg:col-span-2 space-y-8 order-1">
            <h2 className="chalk-heading text-2xl font-bold tracking-tight mb-4">Recent Pitches</h2>
            
            {!ideas || ideas.length === 0 ? (
              <div className="text-center py-12 chalk-text text-2xl border-2 border-dashed border-emerald-500/20 rounded-sm">
                <p>No ideas pitched yet. Be the first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map((idea, index) => {
                  const c = PITCH_COLORS[index % PITCH_COLORS.length];
                  const hasVCReview = Array.isArray(idea.IdeaComment) && idea.IdeaComment.some((comment: any) => comment.isVC);
                  return (
                    <div 
                      key={idea.id}
                      className={`
                        relative flex flex-col p-6 rounded-sm border-2 cursor-interactive
                        shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]
                        ${c.card} ${c.rotate}
                        transition-shadow duration-300
                      `}
                      style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
                    >
                      {/* VC Reviewed Badge */}
                      {hasVCReview && (
                        <div className="absolute top-2 right-3 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm z-20">
                          🔥 VC Reviewed
                        </div>
                      )}
                      {/* Pin */}
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />
                      {/* Tape */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
                      {/* Lined paper texture */}
                      <div
                        className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
                        style={{
                          backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                          backgroundPositionY: "44px",
                        }}
                      />

                      {/* Header info */}
                      <div className="flex items-center gap-3 mb-4 mt-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${c.badge}`}>
                          {(idea.authorName?.[0] || 'A').toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-bold text-sm leading-none ${c.title}`}>{idea.authorName || "Anonymous Founder"}</div>
                          <div className={`text-[11px] font-semibold mt-1 uppercase ${c.tag}`}>
                            {idea.createdAt ? formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true }) : 'Just now'}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info (if available) */}
                      {idea.contactInfo && (
                        <div className={`text-xs font-bold px-2 py-1 rounded-sm border border-current/20 self-start mb-3 ${c.tag}`}>
                          📞 {idea.contactInfo}
                        </div>
                      )}

                      {/* Content */}
                      <div className={`text-[16px] leading-relaxed flex-grow mb-4 ${c.text}`}>
                        <LinkifyText text={idea.content} />
                      </div>

                      {/* Dashed divider */}
                      <div className={`border-b-2 border-dashed ${c.divider} mb-3`} />

                      {/* Footer discussion link */}
                      <Link 
                        href={`/ideas/${idea.id}`}
                        className={`flex items-center gap-1.5 text-sm font-bold mt-auto ${c.tag} hover:underline`}
                      >
                        <MessageSquareQuote className="w-4 h-4" />
                        View Feedback & Discuss
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12 pt-6 border-t border-emerald-500/20" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                {page > 1 ? (
                  <Link 
                    href={`/ideas?page=${page - 1}`}
                    className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10 font-bold text-lg"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-500/10 text-emerald-500/40 font-bold text-lg cursor-not-allowed">Previous</span>
                )}
                
                <span className="text-xl font-bold chalk-text">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link 
                    href={`/ideas?page=${page + 1}`}
                    className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10 font-bold text-lg"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-500/10 text-emerald-500/40 font-bold text-lg cursor-not-allowed">Next</span>
                )}
              </div>
            )}
          </div>

          {/* Submit Idea Form (Desktop only) */}
          <div id="pitch-form" className="hidden lg:block lg:col-span-1 order-2 lg:sticky lg:top-24 lg:self-start mt-4 lg:mt-0">
            <DesktopPitchForm />
          </div>
        </div>
      </div>

      <MobilePitchModal />
    </>
  );
}
