"use client";

import { Reveal, SplitWords } from "@/components/ui/Reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="w-full bg-white border-t border-line">
      <div className="shell py-20 md:py-28">
        <div className="max-w-3xl">
          <SplitWords
            text="Ready to fund your vision?"
            className="text-4xl md:text-6xl font-bold text-ink leading-[1.02]"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-ink-soft max-w-2xl">
              Join thousands of founders who are discovering the right investors, pitching
              anonymously, and raising capital faster.
            </p>
          </Reveal>

          <Reveal delay={0.3} effect="scale" className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link href="/onboarding" className="btn btn-coral group">
              Find investors now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/ideas" className="btn btn-ghost">
              Pitch an idea
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
