import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { LinkifyText } from "@/components/LinkifyText";
import { submitIdeaComment } from "../actions";
import { ChevronLeft } from "lucide-react";

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

  // Bind the action to pass the ideaId, ensuring it returns Promise<void>
  const submitCommentWithId = async (formData: FormData) => {
    "use server";
    await submitIdeaComment(id, formData);
  };

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
              return (
                <div 
                  key={comment.id}
                  className={`
                    relative flex flex-col p-6 rounded-sm border-2
                    shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)]
                    ${cc.card} ${cc.rotate}
                    transition-shadow duration-300
                  `}
                  style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
                >
                  {/* Pin */}
                  <div className={`absolute -top-3 left-8 w-5 h-5 rounded-full ${cc.pin} shadow-md border-2 border-white/80 z-10`} />
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
                    <div className={`font-bold text-sm leading-none ${cc.title}`}>{comment.authorName || "Anonymous Reviewer"}</div>
                    <span className={`text-[12px] font-semibold uppercase ${cc.tag}`}>
                      • {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>

                  <p className={`text-[15px] leading-relaxed ${cc.text}`}>
                    {comment.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment Form */}
        <div 
          className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-[6px_6px_24px_rgba(0,0,0,0.28)]"
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
            <h2 className="text-xl font-bold text-slate-900">Leave Feedback</h2>
          </div>

          <form action={submitCommentWithId} className="space-y-4">
            <div className="space-y-2">
              <input 
                name="authorName" 
                placeholder="Your Name (Optional)" 
                className="w-full bg-transparent border-b-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold px-1 py-1.5 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <textarea 
                name="content" 
                placeholder="What do you think about this idea? How can it be improved?" 
                className="w-full min-h-[100px] bg-transparent border-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-semibold p-2.5 focus:outline-none resize-y rounded-sm"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full mt-2 inline-flex items-center justify-center px-6 h-12 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Post Feedback
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

