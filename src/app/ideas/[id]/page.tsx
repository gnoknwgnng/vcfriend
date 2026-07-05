import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { ChevronLeft } from "lucide-react";
import { CommentForm } from "./CommentForm";

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



  const c = { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", badge: "bg-slate-100 text-slate-800 border-slate-300" };

  const COMMENT_COLORS = [
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.5deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      
      <div className="mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
        <Link 
          href="/ideas" 
          className="inline-flex items-center text-lg font-bold text-emerald-200 hover:text-emerald-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Global Feed
        </Link>
      </div>

      {/* Main Idea Pitch */}
      <div 
        className={`
          relative flex flex-col p-8 rounded-sm border-2
          shadow-[6px_6px_20px_rgba(0,0,0,0.25)] mb-10
          ${c.card}
        `}
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        {/* Pin */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />
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

        <div className="flex items-center gap-4 mb-6 mt-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${c.badge}`}>
            {(idea.authorName?.[0] || 'A').toUpperCase()}
          </div>
          <div className="flex-1">
            <div className={`font-bold text-lg leading-none ${c.title}`}>{idea.authorName || "Anonymous Founder"}</div>
            <div className={`text-[12px] font-semibold mt-1 uppercase ${c.tag}`}>
              Pitched {idea.createdAt ? formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true }) : 'Just now'}
              {idea.contactInfo && (
                <>
                  <span className="mx-2">•</span>
                  <span>Contact: {idea.contactInfo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`text-lg leading-relaxed ${c.text}`}>
          <LinkifyText text={idea.content} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-8">
        <h2 className="chalk-heading text-2xl font-bold tracking-tight mb-6">Discussion & Feedback</h2>
        
        {/* Comments List */}
        <div className="space-y-6">
          {!comments || comments.length === 0 ? (
            <div className="text-center py-10 chalk-text text-xl border-2 border-dashed border-emerald-500/20 rounded-sm mb-8">
              <p>No feedback yet. Be the first to review this idea!</p>
            </div>
          ) : (
            comments.map((comment, index) => {
              const cc = COMMENT_COLORS[index % COMMENT_COLORS.length];
              const isVC = comment.isVC;
              const cardClass = isVC 
                ? "bg-[#f0fdf4] border-emerald-400/90 text-emerald-950 shadow-[4px_4px_16px_rgba(16,185,129,0.15)]" 
                : cc.card;
              const pinClass = isVC ? "bg-emerald-500" : cc.pin;
              const titleClass = isVC ? "text-emerald-900" : cc.title;
              const textClass = isVC ? "text-emerald-950 font-bold" : cc.text;
              const tagClass = isVC ? "text-emerald-700/80" : cc.tag;

              return (
                <div 
                  key={comment.id}
                  className={`
                    relative flex flex-col p-6 rounded-sm border-2
                    shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)]
                    ${cardClass} ${cc.rotate}
                    transition-shadow duration-300
                  `}
                  style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
                >
                  {/* Verified VC Badge */}
                  {isVC && (
                    <div className="absolute top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm z-20">
                      ⭐ Verified VC Review
                    </div>
                  )}
                  {/* Pin */}
                  <div className={`absolute -top-3 left-8 w-5 h-5 rounded-full ${pinClass} shadow-md border-2 border-white/80 z-10`} />
                  {/* Tape */}
                  <div className="absolute -top-3 left-8 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
                  {/* Lined paper texture */}
                  <div
                    className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                      backgroundPositionY: "44px",
                    }}
                  />

                  <div className="flex items-center gap-2 mb-3 mt-2">
                    <div className={`font-bold text-sm leading-none ${titleClass}`}>{comment.authorName || "Anonymous Reviewer"}</div>
                    <span className={`text-[12px] font-semibold uppercase ${tagClass}`}>
                      • {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>

                  <p className={`text-[15px] leading-relaxed ${textClass}`}>
                    {comment.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment Form */}
        <CommentForm ideaId={id} />
      </div>

    </div>
  );
}

