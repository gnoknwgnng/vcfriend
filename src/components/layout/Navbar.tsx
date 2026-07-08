"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-[#1e3a2a] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl tracking-tight chalk-heading">
                VC Friend
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link
                href="/onboarding"
                className="flex items-center text-sm font-medium text-emerald-200/70 hover:text-emerald-100 transition-colors chalk-text"
              >
                VC Firms
              </Link>
              <Link
                href="/ideas"
                className="flex items-center text-sm font-medium text-emerald-200/70 hover:text-emerald-100 transition-colors chalk-text"
              >
                Pitch Ideas
              </Link>
              <Link
                href="/schemes"
                className="flex items-center text-sm font-medium text-emerald-200/70 hover:text-emerald-100 transition-colors chalk-text"
              >
                Govt Schemes
              </Link>
            </nav>
          </div>

          {/* Right Nav / Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/submit-review"
              className="inline-flex items-center gap-1.5 text-[12px] md:text-sm font-bold text-emerald-200 hover:text-emerald-100 transition-colors chalk-text border border-emerald-500/30 px-2 md:px-2.5 py-1.5 rounded-sm bg-emerald-900/30 hover:bg-emerald-900/50 shadow-sm"
            >
              ✏️ <span className="hidden sm:inline">Write a Platform Review</span><span className="sm:hidden">Write a Review</span>
            </Link>
            
            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-emerald-300 hover:text-emerald-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop (Mobile Only) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-45 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out Mobile Drawer Menu */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#0d2216]/95 border-l border-emerald-500/30 backdrop-blur-md p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button inside drawer */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 text-emerald-300 hover:text-emerald-100 focus:outline-none cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col gap-5">
          <Link
            href="/onboarding"
            onClick={() => setIsMenuOpen(false)}
            className="text-base font-bold text-emerald-200 hover:text-emerald-100 transition-colors chalk-text py-2.5 border-b border-emerald-500/10"
          >
            VC Firms
          </Link>
          <Link
            href="/ideas"
            onClick={() => setIsMenuOpen(false)}
            className="text-base font-bold text-emerald-200 hover:text-emerald-100 transition-colors chalk-text py-2.5 border-b border-emerald-500/10"
          >
            Pitch Ideas
          </Link>
          <Link
            href="/schemes"
            onClick={() => setIsMenuOpen(false)}
            className="text-base font-bold text-emerald-200 hover:text-emerald-100 transition-colors chalk-text py-2.5 border-b border-emerald-500/10"
          >
            Govt Schemes
          </Link>
        </nav>
      </div>
    </>
  );
}
