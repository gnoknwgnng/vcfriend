import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { submitIdea } from "./actions";
import { ChevronLeft, MessageSquareQuote } from "lucide-react";
import { MobilePitchModal } from "./MobilePitchModal";

export const revalidate = 0; // Dynamic route

export default async function IdeaFeedPage() {
  const handlePitchAction = async (formData: FormData) => {
    "use server";
    await submitIdea(formData);
  };

  // Fetch ideas from Supabase
  const { data: ideas, error } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt, contactInfo")
    .order("createdAt", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching ideas:", error);
  }

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
          </div>

          {/* Submit Idea Form (Desktop only) */}
          <div id="pitch-form" className="hidden lg:block lg:col-span-1 order-2 lg:sticky lg:top-24 lg:self-start mt-4 lg:mt-0">
            <div 
              className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-[6px_6px_24px_rgba(0,0,0,0.28)] rotate-1"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              {/* Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 shadow-md border-2 border-white/80 z-10" />
              {/* Tape */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
              {/* Lined paper texture */}
              <div
                className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                  backgroundPositionY: "44px",
                }}
              />

              <div className="mt-3 border-b-2 border-dashed border-slate-200 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Pitch Your Idea</h2>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1">What are you building?</p>
              </div>

              <form action={handlePitchAction} className="space-y-4">
                <div className="space-y-3">
                  <input 
                    name="authorName" 
                    placeholder="Your Name (Optional)" 
                    className="w-full bg-transparent border-b-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold px-1 py-1.5 focus:outline-none"
                  />
                  <input 
                    name="contactInfo" 
                    placeholder="Contact Info (Optional)" 
                    className="w-full bg-transparent border-b-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold px-1 py-1.5 focus:outline-none"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <textarea 
                    name="content" 
                    placeholder="I am building a platform that helps..." 
                    className="w-full min-h-[140px] bg-transparent border-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold p-2.5 focus:outline-none resize-none rounded-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full mt-2 inline-flex items-center justify-center px-6 h-12 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  🚀 Submit Pitch
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <MobilePitchModal />
    </>
  );
}
