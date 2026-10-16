import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-line bg-white">
      <div className="shell py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-6 space-y-5">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo-transparent.png"
                alt="VC Friend"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-ink-soft max-w-sm text-base leading-relaxed">
              Empowering founders with transparency and community. Find the perfect investor,
              pitch your ideas safely, and build the future.
            </p>
            <p className="text-sm text-muted-foreground">
              Free for founders, now and always.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-ink">Platform</h4>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li><Link href="/onboarding" className="hover:text-coral transition-colors">VC Directory</Link></li>
              <li><Link href="/ideas" className="hover:text-coral transition-colors">Pitch Ideas</Link></li>
              <li><Link href="/schemes" className="hover:text-coral transition-colors">Government Schemes</Link></li>
              <li><Link href="/submit-review" className="hover:text-coral transition-colors">Leave a Review</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-ink">Legal</h4>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li><Link href="#" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-coral transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-coral transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VC Friend. All rights reserved.</p>
          <p>Made with ❤️ for founders everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
