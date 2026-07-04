"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // negative = slower, positive = faster
  className?: string;
}

// Applies a vertical parallax offset as the user scrolls
export function Parallax({ children, speed = -0.2, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

// Fades + slides up a section as it enters the viewport
export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 95%", "0% 60%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={once ? undefined : { opacity, y }}
      initial={once ? { opacity: 0, y: 60 } : undefined}
      whileInView={once ? { opacity: 1, y: 0 } : undefined}
      viewport={once ? { once: true, margin: "-5% 0px" } : undefined}
      transition={once ? { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scales up a section as it enters view
export function ScaleReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
