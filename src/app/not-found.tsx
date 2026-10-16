import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-24 md:py-32 max-w-2xl text-center">
        <p className="font-display text-7xl md:text-8xl font-bold text-ink/10 leading-none">404</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-ink">This page isn&apos;t in the directory.</h1>
        <p className="mt-3 text-base md:text-lg text-ink-soft">
          The link may be old, or the page may have moved. The firms, pitches and schemes are all still here.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn btn-ink">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <Link href="/vcs" className="btn btn-ghost">
            <Search className="w-4 h-4" /> Browse VC firms
          </Link>
        </div>
      </div>
    </div>
  );
}
