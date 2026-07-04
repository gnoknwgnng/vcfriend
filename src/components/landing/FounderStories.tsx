"use client";

import { motion } from "framer-motion";

const COLORS = [
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "-rotate-1",
    divider: "border-slate-200",
  },
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "rotate-[1.2deg]",
    divider: "border-slate-200",
  },
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "-rotate-[0.6deg]",
    divider: "border-slate-200",
  },
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "rotate-[1.5deg]",
    divider: "border-slate-200",
  },
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "-rotate-1",
    divider: "border-slate-200",
  },
  {
    card: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    title: "text-slate-900",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "text-slate-500",
    rotate: "rotate-[0.8deg]",
    divider: "border-slate-200",
  },
];

const stories = [
  {
    name: "Amazon",
    founder: "Jeff Bezos",
    year: "1994",
    description: "Run from a cramped garage. Stock crashed 94% in 2001. Wall Street called it 'Amazon.bomb'.",
    struggle: "He cut costs to the bone, built AWS internally to survive, and proved every single analyst wrong.",
  },
  {
    name: "Apple",
    founder: "Steve Jobs & Wozniak",
    year: "1976",
    description: "Started in a suburban garage building circuit boards by hand with almost zero capital.",
    struggle: "Jobs sold his VW bus, Wozniak sold his HP calculator — together they raised just $1,350 to start.",
  },
  {
    name: "Facebook",
    founder: "Mark Zuckerberg",
    year: "2004",
    description: "Coded in a Harvard dorm room. Faced massive lawsuits from day one.",
    struggle: "Turned down a $1B acquisition offer from Yahoo when the company had almost no revenue.",
  },
  {
    name: "Airbnb",
    founder: "Brian Chesky & Gebbia",
    year: "2008",
    description: "Renting air mattresses in their apartment to pay rent. Rejected by 15 investors.",
    struggle: "Maxed out credit cards. Sold 'Obama O's' cereal boxes just to keep servers alive.",
  },
  {
    name: "SpaceX / Tesla",
    founder: "Elon Musk",
    year: "2008",
    description: "Tesla was bankrupt. First 3 SpaceX rockets exploded. Both companies near death.",
    struggle: "Split his last $30M between two dying companies. The 4th rocket launch was do-or-die.",
  },
  {
    name: "Disney",
    founder: "Walt Disney",
    year: "1923",
    description: "Fired for 'lacking imagination'. His first studio went bankrupt. Ate dog food to survive.",
    struggle: "His first hit character (Oswald) was legally stolen by his own distributor. He started over.",
  },
];

export function FounderStories() {
  return (
    <section className="w-full py-24 border-y border-emerald-500/20 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">

        {/* Chalk heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold chalk-text mb-5"
            style={{ fontFamily: "var(--font-caveat), cursive", color: "#fbbf24" }}
          >
            Big Things Start Small
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 chalk-heading">
            Every giant faced{" "}
            <span style={{ color: "#fbbf24", textShadow: "0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.3)" }}>
              extinction.
            </span>
          </h2>
          <p className="chalk-text text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Behind every trillion-dollar valuation is a story of bankruptcy, rejection, and sheer survival. Don't quit.
          </p>
        </div>

        {/* Sticky Note Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story, idx) => {
            const c = COLORS[idx % COLORS.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, zIndex: 20 }}
                className={`
                  group relative flex flex-col p-6 rounded-sm border-2 cursor-interactive
                  shadow-[5px_5px_18px_rgba(0,0,0,0.25)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.3)]
                  ${c.card} ${c.rotate}
                  transition-shadow duration-300
                `}
                style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
              >
                {/* Pin */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />

                {/* Tape strip */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 backdrop-blur-sm rounded-sm border border-white/50 shadow-sm" />

                {/* Lined paper texture */}
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.07]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                    backgroundPositionY: "44px",
                  }}
                />

                {/* Year badge */}
                <div className={`self-start mb-4 mt-3 px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase ${c.badge}`}>
                  Est. {story.year}
                </div>

                {/* Company name */}
                <h3 className={`text-3xl font-bold leading-tight mb-1 ${c.title}`}>
                  {story.name}
                </h3>
                <p className={`text-sm font-semibold mb-4 ${c.tag}`}>
                  {story.founder}
                </p>

                {/* Dashed divider */}
                <div className={`border-b-2 border-dashed ${c.divider} mb-4`} />

                {/* Description */}
                <p className={`text-[15px] leading-snug flex-1 mb-3 ${c.text}`}>
                  {story.description}
                </p>

                {/* Struggle - GPU-safe opacity+translate, no max-h layout thrash */}
                <div className={`border-l-4 pl-3 py-1 rounded-sm ${c.divider} opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300 ease-out`}>
                  <p className={`text-[13px] leading-snug italic ${c.text}`}>
                    💡 {story.struggle}
                  </p>
                </div>

                {/* Hover hint */}
                <p className={`text-[11px] mt-3 font-semibold uppercase tracking-widest group-hover:opacity-0 transition-opacity duration-200 ${c.tag}`}>
                  Hover to reveal ↑
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
