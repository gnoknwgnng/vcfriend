import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-[#1e3a2a] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight chalk-heading">
              VC Friend
            </span>
          </Link>
          
          {/* Main Navigation */}
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
          </nav>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}
