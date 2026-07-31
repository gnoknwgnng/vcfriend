"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Preloader } from "../ui/Preloader";
import { SmoothScroll } from "../ui/SmoothScroll";
import React from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-slate-950 font-sans">
        {children}
      </main>
    );
  }

  return (
    <>
      <Preloader />
      <SmoothScroll>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </SmoothScroll>

      {/* Realistic Chalkboard Border Frame Overlay */}
      {/* Left Border */}
      <div 
        className="fixed left-0 top-0 bottom-0 shadow-lg border-r border-slate-400/30 z-40 pointer-events-none"
        style={{ 
          width: 'var(--board-frame-thickness)',
          backgroundImage: 'linear-gradient(to right, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
        }}
      />
      {/* Right Border */}
      <div 
        className="fixed right-0 top-0 bottom-0 shadow-lg border-l border-slate-400/30 z-40 pointer-events-none"
        style={{ 
          width: 'var(--board-frame-thickness)',
          backgroundImage: 'linear-gradient(to left, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
        }}
      />
      {/* Top Border */}
      <div 
        className="fixed top-0 left-0 right-0 shadow-md border-b border-slate-400/30 z-40 pointer-events-none"
        style={{ 
          height: 'var(--board-frame-thickness)',
          backgroundImage: 'linear-gradient(to bottom, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
        }}
      />
      {/* Bottom Border */}
      <div 
        className="fixed bottom-0 left-0 right-0 shadow-md border-t border-slate-400/30 z-40 pointer-events-none"
        style={{ 
          height: 'var(--board-frame-thickness)',
          backgroundImage: 'linear-gradient(to top, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
        }}
      />

      {/* Realistic Inner Shadow Border */}
      <div 
        className="fixed pointer-events-none inset-0 border border-black/40 z-40"
        style={{ margin: 'var(--board-frame-thickness)' }}
      />

      {/* Frame Corner Metal Brackets with Screws */}
      <div 
        className="fixed top-0 left-0 bg-[#262626] border border-neutral-700/60 rounded-br-[3px] shadow-[2px_2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in pointer-events-none"
        style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
      />
      <div 
        className="fixed top-0 right-0 bg-[#262626] border border-neutral-700/60 rounded-bl-[3px] shadow-[-2px_2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in pointer-events-none"
        style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
      />
      <div 
        className="fixed bottom-0 left-0 bg-[#262626] border border-neutral-700/60 rounded-tr-[3px] shadow-[2px_-2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in pointer-events-none"
        style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
      />
      <div 
        className="fixed bottom-0 right-0 bg-[#262626] border border-neutral-700/60 rounded-tl-[3px] shadow-[-2px_-2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in pointer-events-none"
        style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
      />
    </>
  );
}
