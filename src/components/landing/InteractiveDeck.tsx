"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function InteractiveDeck() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  return (
    <div className="w-full flex justify-center py-24 perspective-[1000px] z-20 cursor-interactive">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        style={{ x, y, rotateX, rotateY, z: 100 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, cursor: "grabbing" }}
        className="relative w-80 h-96 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl overflow-hidden cursor-grab flex flex-col justify-between p-6 transform-gpu"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="h-4 w-12 bg-emerald-500/80 rounded-full mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 drop-shadow-sm">Seed Deck v3</h3>
          <p className="text-sm text-slate-600 mt-2 font-medium">Grab and toss me around!</p>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div className="h-full w-[70%] bg-emerald-500 rounded-full" />
          </div>
          <div className="h-2 w-[80%] bg-slate-200/50 rounded-full" />
          <div className="h-2 w-[60%] bg-slate-200/50 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
