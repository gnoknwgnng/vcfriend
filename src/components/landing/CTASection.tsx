"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full relative py-24 md:py-32 overflow-hidden bg-transparent">
      {/* Abstract Background Glow (Chalkboard Friendly) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[120%] bg-teal-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto"
        >
          <h2 className="chalk-heading text-4xl md:text-6xl font-extrabold tracking-tight">
            Ready to fund your vision?
          </h2>
          <p className="chalk-text text-xl md:text-2xl leading-relaxed text-emerald-100/90">
            Join thousands of founders who are discovering the right investors, pitching anonymously, and raising capital faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-4 w-full sm:w-auto" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            <Link 
              href="/onboarding" 
              className="flex items-center justify-center rounded-sm px-10 h-14 text-xl font-bold bg-[#faf8f2] text-slate-800 border-2 border-[#e3dccb] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] hover:bg-[#f6f3e6] transition-all hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
            >
              Find Investors Now
            </Link>
            <Link 
              href="/ideas" 
              className="flex items-center justify-center rounded-sm px-10 h-14 text-xl font-bold border-2 border-dashed border-emerald-400/60 text-[#7ae0a0] hover:bg-emerald-500/10 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              Pitch an Idea
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
