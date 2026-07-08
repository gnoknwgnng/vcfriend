"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { VelocityScroll } from "@/components/ui/VelocityScroll";
import { HeroQuestions } from "@/components/landing/HeroQuestions";
import { TextReveal } from "@/components/ui/TextReveal";
import { RevealOnScroll } from "@/components/ui/ScrollAnimations";

export function HeroSection() {
  return (
    <section className="w-full relative min-h-[75vh] overflow-hidden flex flex-col items-center justify-center text-center pt-10 pb-8">
      {/* Remove image - chalkboard CSS background from parent handles it */}
      {/* Enhanced board glow layers */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-400/5 rounded-[100%] blur-[120px] animate-pulse z-[2] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-[100%] blur-[100px] z-[2] pointer-events-none" />
      
      <div className="container px-4 md:px-6 relative z-10 pt-10 pb-8">
        <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 backdrop-blur-md px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-1 hover:bg-emerald-500/30 transition-colors cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-3 animate-ping absolute"></span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-3"></span>
            The #1 Platform for Founders
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="space-y-3 md:space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <span className="block overflow-hidden">
                <motion.span
                  className="block chalk-heading animate-fade-in"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Find the Right
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block animate-fade-in"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="relative inline-block mr-2 select-none">
                    <span className="chalk-green chalk-underline">
                      Investor
                    </span>
                    <svg 
                      className="absolute -bottom-2 left-0 w-full h-[18px] text-emerald-400 z-0" 
                      viewBox="0 0 200 20" 
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M 0 15 Q 50 0 100 12 T 200 15"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                      />
                    </svg>
                  </span>{" "}
                  <span className="chalk-heading">
                    for Your Startup
                  </span>
                </motion.span>
              </span>
            </h1>
            <RevealOnScroll once={false} delay={0.2}>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl font-medium leading-relaxed mt-2 md:mt-4">
                <span className="chalk-text">
                  Explore thousands of active venture capital firms, pitch your ideas to the community, and make smarter fundraising decisions—
                </span>
                <strong className="chalk-green">completely free.</strong>
              </p>
            </RevealOnScroll>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-10 w-full sm:w-auto"
          >
            <MagneticButton href="/onboarding">
              <span className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-600 px-10 text-lg font-bold text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] hover:bg-emerald-500 hover:shadow-[0_15px_50px_-10px_rgba(16,185,129,0.9)] transition-all w-full sm:w-auto group">
                Explore VC Firms 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
            
            <MagneticButton href="/ideas">
              <span className="inline-flex h-14 items-center justify-center rounded-full border-2 border-emerald-800/10 bg-[#faf8f2] px-10 text-lg font-bold text-slate-800 shadow-md hover:bg-white hover:text-slate-900 transition-all w-full sm:w-auto">
                Pitch Your Idea
              </span>
            </MagneticButton>
          </motion.div>
          
          {/* New 8-Card Grid replacing the 3D Deck */}
          <div className="mt-8">
            <HeroQuestions />
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Velocity Marquee styled like a moving strip of paper tape */}
      <div className="w-full relative z-10 mt-12 mb-16 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] bg-[#faf8f2] py-4 border-y-2 border-dashed border-[#e3dccb]">
        {/* Lined paper texture inside the tape */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.12]"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 12px, #000 12px, #000 13px)",
          }}
        />
        {/* Red margin lines on top and bottom of the tape */}
        <div className="absolute top-1 left-0 right-0 h-[1px] bg-red-400/30" />
        <div className="absolute bottom-1 left-0 right-0 h-[1px] bg-red-400/30" />
        
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#2c4f3a] to-transparent z-10 pointer-events-none opacity-50" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#2c4f3a] to-transparent z-10 pointer-events-none opacity-50" />
        
        <VelocityScroll baseVelocity={-1.5}>
          <div 
            className="flex items-center gap-12 mx-6 text-2xl font-bold text-slate-800 tracking-wide cursor-interactive select-none"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <span>100% Free for Founders</span>
            <span className="text-red-500/60">•</span>
            <span>Anonymous Pitching</span>
            <span className="text-red-500/60">•</span>
            <span>Verified VC Reviews</span>
            <span className="text-red-500/60">•</span>
            <span>Community Driven</span>
            <span className="text-red-500/60">•</span>
            <span>Transparent Fundraising</span>
            <span className="text-red-500/60">•</span>
          </div>
        </VelocityScroll>
      </div>
      
      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
