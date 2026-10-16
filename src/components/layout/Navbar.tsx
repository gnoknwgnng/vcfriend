"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PenLine } from "lucide-react";

const NAV_LINKS = [
  { href: "/onboarding", label: "VC Firms", match: ["/onboarding", "/vcs"] },
  { href: "/ideas", label: "Pitch Ideas", match: ["/ideas"] },
  { href: "/schemes", label: "Govt Schemes", match: ["/schemes"] },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Tuck the bar away when scrolling down past the first screen, bring it back on any upward scroll.
      if (y > 160 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y <= 160) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show the bar when the drawer is open
  useEffect(() => { if (isMenuOpen) setHidden(false); }, [isMenuOpen]);

  const isActive = (matches: string[]) =>
    matches.some((m) => pathname === m || pathname?.startsWith(m + "/"));

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-[background-color,box-shadow,border-color,transform] duration-300 border-b ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-line shadow-[0_1px_0_rgba(15,42,51,0.04),0_8px_24px_-20px_rgba(15,42,51,0.35)]"
            : "bg-mist/80 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="VC Friend home">
            <img
              src="/images/logo-transparent.png"
              alt="VC Friend"
              className="h-11 md:h-12 w-auto object-contain -my-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-line bg-white/70 p-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-9 px-4 inline-flex items-center rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-ink text-white"
                      : "text-ink-soft hover:text-ink hover:bg-mist"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/submit-review"
              className="btn btn-sm btn-ink hidden sm:inline-flex"
            >
              <PenLine className="w-4 h-4" />
              Write a platform review
            </Link>
            <Link
              href="/submit-review"
              className="btn btn-sm btn-ink sm:hidden px-3"
              aria-label="Write a platform review"
            >
              <PenLine className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-line bg-white text-ink cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop (mobile) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-45 bg-ink/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[82vw] max-w-sm bg-white border-l border-line shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-[68px] border-b border-line">
          <span className="font-display font-semibold text-ink">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-line text-ink cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                  active ? "bg-ink text-white" : "text-ink hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-line">
          <Link
            href="/submit-review"
            onClick={() => setIsMenuOpen(false)}
            className="btn btn-coral w-full"
          >
            <PenLine className="w-4 h-4" />
            Write a platform review
          </Link>
        </div>
      </div>
    </>
  );
}
