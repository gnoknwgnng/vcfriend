import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-transparent border-t border-border/40 py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img 
                src="/images/logo-transparent.png" 
                alt="VC Friend Logo" 
                className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
              Empowering founders with transparency and community. Find the perfect investor, pitch your ideas safely, and build the future.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/onboarding" className="hover:text-primary transition-colors">VC Directory</Link></li>
              <li><Link href="/ideas" className="hover:text-primary transition-colors">Pitch Ideas</Link></li>
              <li><Link href="/submit-review" className="hover:text-primary transition-colors">Leave a Review</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VC Friend. All rights reserved.</p>
          <p>Made with ❤️ for founders everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
