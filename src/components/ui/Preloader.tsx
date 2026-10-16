"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only show preloader if not already shown this session
    const seen = sessionStorage.getItem("vc-friend-loaded");
    if (seen) {
      setIsLoading(false);
      return;
    }

    // Animate count from 0 to 100
    let start = 0;
    const duration = 800; // ms — snappy loading feel
    const steps = 80;
    const increment = 100 / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setCount(100);
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("vc-friend-loaded", "true");
        }, 150); // snappier hold before sliding away
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center ink-panel overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 dot-grid pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mb-10 text-center"
          >
            <span className="font-display text-4xl font-bold tracking-tight text-white">
              VC <span className="text-coral">Friend</span>
            </span>
            <p className="text-white/55 text-sm mt-2">Free fundraising tools for founders</p>
          </motion.div>

          <div className="relative w-48 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-coral rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mt-4 text-white/50 text-xs font-mono tabular-nums"
          >
            {String(count).padStart(3, "0")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
