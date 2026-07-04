"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquareQuote } from "lucide-react";

interface SocialProofProps {
  testimonials: any[];
  latestIdeas: any[];
  reviewsCount: number;
}

export function SocialProof({ testimonials, latestIdeas, reviewsCount }: SocialProofProps) {
  return (
    <>
      {/* Latest Pitches Section */}
      <section className="w-full py-16 md:py-24 bg-transparent border-t border-emerald-500/20 overflow-hidden">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14"
          >
            <div>
              <h2 className="chalk-heading text-3xl md:text-5xl font-bold tracking-tight mb-2">
                Recent Community Pitches
              </h2>
              <p className="chalk-text text-lg">See what other founders are building right now.</p>
            </div>
            <Link
              href="/ideas"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-emerald-400/40 text-emerald-300 chalk-text text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              View All Pitches <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!latestIdeas || latestIdeas.length === 0 ? (
              <div className="col-span-3 text-center py-12 chalk-text">No recent pitches yet.</div>
            ) : (
              latestIdeas.map((idea, index) => {
                const PITCH_COLORS = [
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-1" },
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[1.2deg]" },
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.6deg]" },
                ];
                const c = PITCH_COLORS[index % PITCH_COLORS.length];
                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 40, scale: 0.93 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04, zIndex: 20 }}
                    className={`
                      relative flex flex-col p-6 rounded-sm border-2 cursor-interactive
                      shadow-[5px_5px_18px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]
                      ${c.card} ${c.rotate}
                      transition-shadow duration-300
                    `}
                    style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
                  >
                    {/* Pin */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />
                    {/* Tape */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
                    {/* Lined paper */}
                    <div
                      className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.07]"
                      style={{
                        backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                        backgroundPositionY: "44px",
                      }}
                    />

                    {/* Quote icon */}
                    <MessageSquareQuote className={`h-7 w-7 mb-4 mt-3 ${c.tag}`} />

                    {/* Content */}
                    <p className={`text-[15px] leading-snug flex-1 mb-4 ${c.text}`}>
                      {idea.content?.length > 180 ? idea.content.slice(0, 180) + "…" : idea.content}
                    </p>

                    {/* Dashed divider */}
                    <div className={`border-b-2 border-dashed ${c.divider} mb-3`} />

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-widest ${c.tag}`}>
                        {idea.authorName && idea.authorName.trim() !== "" ? idea.authorName : "Anonymous Founder"}
                      </span>
                      <span className={`text-xs font-semibold ${c.tag}`} suppressHydrationWarning>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>


      {/* Community Banner — Large Sticky Note */}
      <section className="container px-4 md:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.015 }}
          className="relative rounded-sm border-2 border-slate-200 bg-white
            shadow-[6px_6px_24px_rgba(0,0,0,0.28)] -rotate-[0.4deg]
            transition-shadow duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.3)]
            overflow-hidden"
          style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
        >
          {/* Three pins across the top */}
          <div className="absolute -top-3 left-12 w-6 h-6 rounded-full bg-teal-400 shadow-md border-2 border-white/80 z-10" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-teal-500 shadow-md border-2 border-white/80 z-10" />
          <div className="absolute -top-3 right-12 w-6 h-6 rounded-full bg-teal-400 shadow-md border-2 border-white/80 z-10" />

          {/* Wide tape strip across the top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-6 bg-white/40 rounded-sm border border-white/50 shadow-sm" />

          {/* Lined paper texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 28px, rgba(0,0,0,0.5) 28px, rgba(0,0,0,0.5) 29px)",
              backgroundPositionY: "52px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-10 md:p-14 pt-12">
            {/* Left — Text */}
            <div className="flex-1 space-y-5">
              {/* Small tag */}
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 border border-teal-300 bg-teal-200 px-3 py-1 rounded-full">
                📌 Community Note
              </span>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-teal-900">
                VC Friend Will Always Be Free
              </h2>

              {/* Dashed divider */}
              <div className="border-b-2 border-dashed border-teal-300/70" />

              <p className="text-[17px] leading-relaxed text-teal-900/80">
                We believe fundraising should be transparent and accessible to every founder.
                We never charge founders to discover investors. If this platform helped you,
                the best way to support us is by sharing your experience below!
              </p>

              <div className="pt-2">
                <Link
                  href="/submit-review"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-sm border-2 border-teal-400
                    bg-teal-200 hover:bg-teal-300 text-teal-900 font-bold text-lg
                    shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)]
                    transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  ✏️ Write a Platform Review
                </Link>
              </div>
            </div>

            {/* Right — decorative large pin / doodle area */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4 w-52 shrink-0">
              <div className="w-40 h-40 rounded-sm border-2 border-dashed border-teal-400/60 flex items-center justify-center bg-teal-50/60">
                <div className="text-center">
                  <div className="text-6xl mb-2">🌱</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Free Forever</p>
                </div>
              </div>
              {/* Fake sticky arrow doodle */}
              <svg width="80" height="40" viewBox="0 0 80 40" className="text-teal-400/60" fill="none">
                <path d="M5 20 Q40 5 70 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 4"/>
                <path d="M62 14 L70 20 L62 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>


      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 bg-transparent border-t border-emerald-500/20 overflow-hidden">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="chalk-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by Founders</h2>
            <p className="chalk-text text-lg max-w-2xl mx-auto">
              See what other entrepreneurs are saying about their experience using VC Friend.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {!testimonials || testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12 chalk-text text-2xl">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              testimonials.map((review, index) => {
                const REVIEW_COLORS = [
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-1", badge: "bg-slate-100 text-slate-800 border-slate-300" },
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
                  { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[1.2deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
                ];
                const c = REVIEW_COLORS[index % REVIEW_COLORS.length];
                return (
                  <motion.div 
                    key={review.id} 
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04, zIndex: 10 }}
                    className={`
                      relative flex flex-col p-6 rounded-sm border-2 cursor-interactive
                      shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]
                      ${c.card} ${c.rotate}
                      transition-shadow duration-300
                    `}
                    style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
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

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4 mt-3 text-amber-500">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg key={j} className={`w-5 h-5 ${j < review.rating ? 'fill-current text-amber-400' : 'text-slate-300 stroke-current fill-none'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className={`flex-grow mb-6 italic text-[16px] leading-relaxed ${c.text}`}>
                      &quot;{review.content}&quot;
                    </p>

                    {/* Dashed divider */}
                    <div className={`border-b-2 border-dashed ${c.divider} mb-3`} />

                    <div className="flex items-center gap-3 mt-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${c.badge}`}>
                        {(review.authorName?.[0] || 'A').toUpperCase()}
                      </div>
                      <div className={`font-bold text-sm ${c.tag}`}>
                        {review.authorName || "Anonymous Founder"}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-28 border-y border-emerald-500/20 relative overflow-hidden bg-transparent">
        {/* Transparent grid style chalkboard stats */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "2,000+", label: "VC Firms" },
              { stat: reviewsCount.toString(), label: "Founder Reviews" },
              { stat: "120+", label: "Industries" },
              { stat: "40+", label: "Countries" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Statistics numbers styled like chalk writing */}
                <div className="text-5xl md:text-6xl font-extrabold chalk-heading" style={{ color: "#86efac" }}>
                  {item.stat}
                </div>
                {/* Labels styled like chalk writing */}
                <div className="text-base font-semibold tracking-wider uppercase chalk-text" style={{ color: "#d4f0e0" }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
