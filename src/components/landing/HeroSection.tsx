"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lightbulb, Landmark } from "lucide-react";
import { HeroQuestions } from "@/components/landing/HeroQuestions";
import { VelocityScroll } from "@/components/ui/VelocityScroll";
import { CountUp, Parallax, TiltCard, Reveal } from "@/components/ui/Reveal";

/* Node network echoing the VC Friend logo — founders on the left, investors on the right */
function NetworkGraph() {
  const nodes = [
    { x: 40, y: 150, r: 7, c: "#e5715a", d: 0 },
    { x: 120, y: 60, r: 5, c: "#9b7fb8", d: 0.6 },
    { x: 130, y: 240, r: 6, c: "#9b7fb8", d: 1.1 },
    { x: 230, y: 130, r: 9, c: "#ffffff", d: 0.3 },
    { x: 330, y: 50, r: 6, c: "#9b7fb8", d: 0.9 },
    { x: 350, y: 220, r: 7, c: "#e5715a", d: 1.5 },
    { x: 440, y: 140, r: 8, c: "#7fc3cf", d: 0.4 },
    { x: 520, y: 70, r: 5, c: "#e5715a", d: 1.8 },
    { x: 530, y: 230, r: 6, c: "#9b7fb8", d: 0.2 },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [6, 7], [6, 8],
  ];

  return (
    <svg
      viewBox="0 0 560 300"
      className="w-full h-auto"
      role="img"
      aria-label="Network of founders connected to investors"
    >
      <defs>
        <linearGradient id="edge" x1="0" x2="1">
          <stop offset="0" stopColor="#7fc3cf" stopOpacity="0.2" />
          <stop offset="1" stopColor="#7fc3cf" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#edge)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3 + i * 0.08, ease: "easeOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r * 2.6} fill={n.c} opacity="0.08" className="node-pulse" style={{ animationDelay: `${n.d}s` }} />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.c}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 + i * 0.07 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        </g>
      ))}
      {/* The trend arrow from the logo */}
      <motion.path
        d="M 395 215 L 520 95"
        stroke="#e5715a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.3, ease: "easeOut" }}
      />
      <motion.path
        d="M 494 92 L 522 92 L 522 120"
        stroke="#e5715a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2.1 }}
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="w-full ink-panel relative overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="shell relative z-10 pt-16 md:pt-24 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-coral opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
              </span>
              The #1 platform for founders
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem] font-bold text-white"
            >
              Find the right investor for your startup.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-white/75"
            >
              Explore thousands of active venture capital firms, pitch your ideas to the
              community, and make smarter fundraising decisions — completely free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Link href="/onboarding" className="btn btn-coral group">
                <Building2 className="w-4 h-4" />
                Explore VC firms
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/ideas" className="btn btn-ghost-light">
                <Lightbulb className="w-4 h-4" />
                Pitch your idea
              </Link>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-2 h-12 px-3 text-sm font-semibold text-white/75 hover:text-white transition-colors"
              >
                <Landmark className="w-4 h-4" />
                Government schemes
              </Link>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-white/10 pt-6"
            >
              {[
                { v: "2,000+", k: "VC firms" },
                { v: "220+", k: "Govt schemes" },
                { v: "40+", k: "Countries" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl md:text-3xl font-bold text-white"><CountUp value={s.v} /></dt>
                  <dd className="text-sm text-white/55 mt-0.5">{s.k}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Network illustration */}
          <div className="lg:col-span-5 relative">
            <Parallax speed={0.18}>
            <TiltCard className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
              <div className="flex items-center justify-between text-xs text-white/55 mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-coral" /> Founders
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7fc3cf]" /> Investors
                </span>
              </div>
              <NetworkGraph />
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                Every connection on VC Friend is made in the open: real firms, real founder
                reviews, no paywall between you and the data.
              </p>
            </TiltCard>
            </Parallax>
          </div>
        </div>

        {/* Stage explorer */}
        <Reveal className="mt-16 md:mt-24" amount={0.15}>
          <HeroQuestions />
        </Reveal>
      </div>

      {/* Value strip — drifts with scroll velocity */}
      <div className="relative z-10 border-t border-white/10 bg-ink/40 py-4">
        <VelocityScroll baseVelocity={-0.6} className="text-white/65">
          <div className="flex items-center gap-10 pr-10 text-sm normal-case tracking-normal font-medium">
            {[
              "100% free for founders",
              "Anonymous pitching",
              "Verified VC reviews",
              "Community driven",
              "Transparent fundraising",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-3 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-coral/80" />
                {t}
              </span>
            ))}
          </div>
        </VelocityScroll>
      </div>
    </section>
  );
}
