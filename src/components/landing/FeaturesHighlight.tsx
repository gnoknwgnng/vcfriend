"use client";

import Link from "next/link";
import { Search, Lightbulb, ShieldCheck, BarChart3, Users, ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, SplitWords } from "@/components/ui/Reveal";

const FEATURES = [
  {
    icon: Search,
    title: "Discover investors",
    description:
      "Filter through thousands of VC firms by stage, sector, and check size. Stop guessing and find the perfect match for your startup's current trajectory.",
    href: "/onboarding",
    cta: "Browse the directory",
    tone: "teal",
    span: "md:col-span-7",
  },
  {
    icon: Lightbulb,
    title: "Pitch anonymously",
    description:
      "Share your startup ideas safely with a community of verified founders and investors. Get instant, honest feedback without risking your reputation.",
    badge: "100% identity protection",
    badgeIcon: ShieldCheck,
    href: "/ideas",
    cta: "Pitch an idea",
    tone: "coral",
    span: "md:col-span-5",
  },
  {
    icon: BarChart3,
    title: "Market data",
    description: "Real-time insights on which sectors are actively receiving funding right now.",
    href: "/vcs",
    cta: "See active firms",
    tone: "lavender",
    span: "md:col-span-5",
  },
  {
    icon: Users,
    title: "Founder network",
    description: "Connect directly with peers navigating the exact same fundraising journey.",
    href: "/ideas",
    cta: "Join the conversation",
    tone: "teal",
    span: "md:col-span-7",
  },
];

const TONES: Record<string, { icon: string; glow: string }> = {
  teal: { icon: "bg-teal-light text-teal-deep", glow: "from-teal-light" },
  coral: { icon: "bg-coral-light text-coral-deep", glow: "from-coral-light" },
  lavender: { icon: "bg-lavender-light text-[#5e4580]", glow: "from-lavender-light" },
};

export function FeaturesHighlight() {
  return (
    <section className="w-full py-20 md:py-28 bg-white border-y border-line">
      <div className="shell">
        <div className="max-w-2xl mb-12 md:mb-16">
          <SplitWords
            text="A complete toolkit for fundraising."
            className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]"
          />
          <Reveal delay={0.2}>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">
              Everything you need to navigate the ecosystem, neatly organized in one place.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const BadgeIcon = feature.badgeIcon;
            const tone = TONES[feature.tone];
            return (
              <Reveal
                key={feature.title}
                effect={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={(idx % 2) * 0.1}
                className={`${feature.span} group relative overflow-hidden rounded-3xl border border-line bg-mist p-7 md:p-8 flex flex-col surface-hover`}
              >
                <div
                  className={`pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${tone.glow} to-transparent opacity-70 transition-transform duration-700 group-hover:scale-125`}
                />
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105 ${tone.icon}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>

                <h3 className="relative mt-6 text-2xl font-semibold text-ink">{feature.title}</h3>
                <p className="relative mt-3 text-[15px] md:text-base leading-relaxed text-ink-soft flex-1 max-w-prose">
                  {feature.description}
                </p>

                <div className="relative mt-6 flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-coral transition-colors"
                  >
                    {feature.cta}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  {feature.badge && BadgeIcon && (
                    <span className="tag tag-teal">
                      <BadgeIcon className="h-3.5 w-3.5" />
                      {feature.badge}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
