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
    const duration = 3500; // ms — longer loading feel
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
        }, 900); // hold at 100% longer before sliding away
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)] pointer-events-none" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <span className="text-4xl font-extrabold tracking-tight text-white">
              VC{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                Friend
              </span>
            </span>
            <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">
              For Founders
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-500 text-xs font-mono tabular-nums"
          >
            {String(count).padStart(3, "0")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
