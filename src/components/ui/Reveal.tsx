"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────
   Shared motion vocabulary for VC Friend.
   One easing, one distance, one blur — so every page moves the same way.
   ────────────────────────────────────────────────────────────────────── */

export const EASE = [0.16, 1, 0.3, 1] as const;

type Effect = "rise" | "fade" | "scale" | "slide-left" | "slide-right";

/* A variant's own transition wins over the `transition` prop in framer-motion,
   so the delay is baked into the variant here. */
function pickVariants(effect: Effect, delay = 0): Variants {
  const t = (duration: number) => ({ duration, ease: EASE, delay });
  switch (effect) {
    case "fade":
      return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: t(0.6) } };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.96, y: 16 },
        visible: { opacity: 1, scale: 1, y: 0, transition: t(0.75) },
      };
    case "slide-left":
      return {
        hidden: { opacity: 0, x: -32, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: t(0.7) },
      };
    case "slide-right":
      return {
        hidden: { opacity: 0, x: 32, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: t(0.7) },
      };
    default:
      return {
        hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: t(0.7) },
      };
  }
}

/** Reveals a block when it scrolls into view. */
export function Reveal({
  children,
  className = "",
  effect = "rise",
  delay = 0,
  once = true,
  amount = 0.2,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  effect?: Effect;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "figure";
}) {
  const reduce = useReducedMotion();
  const Comp = (motion as any)[as] as typeof motion.div;
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      variants={pickVariants(effect, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </Comp>
  );
}

/** Staggers its direct children into view. Wrap grids and lists with this.
 *  Each child observes the viewport itself, so long lists reveal row by row
 *  as you scroll instead of all at once; `cols` sets the stagger rhythm. */
export function RevealGroup({
  children,
  className = "",
  effect = "rise",
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.1,
  cols = 3,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  effect?: Effect;
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  cols?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = (motion as any)[as] as typeof motion.div;
  if (reduce) return <Comp className={className}>{children}</Comp>;

  const items = React.Children.toArray(children);
  return (
    <Comp className={className}>
      {items.map((child, i) =>
        React.isValidElement(child) ? (
          <motion.div
            key={(child as any).key ?? i}
            variants={pickVariants(effect, delay + (i % cols) * stagger)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
            className="flex flex-col h-full min-w-0 [&>*]:w-full [&>*]:flex-1"
            style={{ willChange: "transform, opacity" }}
          >
            {child}
          </motion.div>
        ) : child
      )}
    </Comp>
  );
}

/** Word-by-word headline reveal. Keeps the heading tag semantic. */
export function SplitWords({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  once = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref as any} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            aria-hidden
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.7, delay: delay + i * 0.05, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/** Counts a number up when it scrolls into view. Accepts "2,000+", "₹0", "103". */
export function CountUp({
  value,
  className = "",
  duration = 1.4,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : NaN;
  const suffix = match?.[3] ?? "";
  const hasCommas = match ? match[2].includes(",") : false;

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const n = Math.round(target * eased);
      setDisplay(`${prefix}${hasCommas ? n.toLocaleString("en-US") : n}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, prefix, suffix, hasCommas, duration, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}

/** Moves children vertically at a fraction of scroll speed. */
export function Parallax({
  children,
  className = "",
  speed = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}

/** Thin progress line at the very top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-coral z-[60] pointer-events-none"
      style={{ scaleX }}
    />
  );
}

/** Floating "back to top" pill that appears after the first screen. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed bottom-6 left-5 z-40 w-11 h-11 rounded-full bg-white border border-line shadow-[0_10px_30px_-12px_rgba(15,42,51,0.4)] text-ink flex items-center justify-center hover:bg-mist transition-colors cursor-pointer"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
      </svg>
    </motion.button>
  );
}

/** Subtle tilt that follows the pointer — for the hero illustration card. */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 8);
    rx.set(-py * 8);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
