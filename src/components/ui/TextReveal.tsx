"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

// Splits text into words, each word slides up from a mask on scroll
export function TextReveal({ text, className = "", delay = 0, once = true }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariant = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`flex flex-wrap gap-x-[0.25em] gap-y-1 ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block pb-1">
          <motion.span variants={wordVariant} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

// A simpler line-by-line reveal for subtitles
export function LineReveal({
  lines,
  className = "",
  delay = 0,
  once = true,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
