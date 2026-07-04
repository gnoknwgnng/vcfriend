"use client";

import { Search, Lightbulb, ShieldCheck, BarChart3, Users } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { RevealOnScroll } from "@/components/ui/ScrollAnimations";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Search,
    title: "Discover Investors",
    description:
      "Filter through thousands of VC firms by stage, sector, and check size. Stop guessing and find the perfect match for your startup's current trajectory.",
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    textColor: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
    rotate: "-rotate-1",
    size: "md:col-span-2 md:row-span-1",
  },
  {
    icon: Lightbulb,
    title: "Pitch Anonymously",
    description:
      "Share your startup ideas safely with a community of verified founders and investors. Get instant, honest feedback without risking your reputation.",
    badge: "100% Identity Protection",
    badgeIcon: ShieldCheck,
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    textColor: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
    rotate: "rotate-[1.5deg]",
    size: "md:col-span-1 md:row-span-2",
  },
  {
    icon: BarChart3,
    title: "Market Data",
    description:
      "Real-time insights on which sectors are actively receiving funding right now.",
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    textColor: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
    rotate: "rotate-1",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Users,
    title: "Founder Network",
    description:
      "Connect directly with peers navigating the exact same fundraising journey.",
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    textColor: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
    rotate: "-rotate-[0.8deg]",
    size: "md:col-span-1 md:row-span-1",
  },
];

export function FeaturesHighlight() {
  return (
    <section className="w-full py-24 border-y border-emerald-500/20 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Chalk-written heading */}
        <div className="text-center mb-16">
          <TextReveal
            text="A complete toolkit for fundraising."
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 chalk-heading justify-center"
          />
          <RevealOnScroll delay={0.2}>
            <p className="chalk-text text-xl max-w-2xl mx-auto font-medium">
              Everything you need to navigate the ecosystem, neatly organized in one place.
            </p>
          </RevealOnScroll>
        </div>

        {/* Sticky Note Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const BadgeIcon = feature.badgeIcon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}
                className={`
                  relative flex flex-col p-7 rounded-sm border-2 cursor-interactive
                  shadow-[5px_5px_18px_rgba(0,0,0,0.25)]
                  ${feature.color} ${feature.rotate} ${feature.size}
                  transition-[box-shadow] duration-300
                `}
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                {/* Pin */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${feature.pin} shadow-md border-2 border-white/80 z-10`} />

                {/* Tape strip */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 backdrop-blur-sm rounded-sm border border-white/50 shadow-sm" />

                {/* Lined paper texture */}
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.08]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                    backgroundPositionY: "42px",
                  }}
                />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 mt-3 shadow-sm ${feature.iconBg}`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-3 leading-tight ${feature.titleColor}`}>
                  {feature.title}
                </h3>

                {/* Dashed divider */}
                <div className="border-b-2 border-dashed border-current/20 mb-3" />

                {/* Description */}
                <p className={`text-base leading-relaxed flex-1 ${feature.textColor}`}>
                  {feature.description}
                </p>

                {/* Optional badge */}
                {feature.badge && BadgeIcon && (
                  <div className="mt-5 pt-4 border-t-2 border-dashed border-current/20">
                    <div className="flex items-center gap-2">
                      <BadgeIcon className="h-4 w-4 text-sky-600 shrink-0" />
                      <span className="text-sm font-bold text-sky-800">{feature.badge}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
