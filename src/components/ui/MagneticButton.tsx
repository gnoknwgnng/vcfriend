"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", href, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = rectRef.current;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    rectRef.current = null;
  };

  const { x, y } = position;

  const content = (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
      className={`cursor-interactive inline-block ${className}`}
      onClick={onClick}
    >
      <motion.div
        animate={{ x: x * 0.5, y: y * 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
