import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VC Friend - Free Startup Fundraising Platform & Investors",
  description: "Find active venture capital firms, search 220+ government funding schemes, explore startup grants, and pitch your ideas to verified investors completely free.",
  keywords: [
    "fundraising",
    "startup fundraising",
    "fundraising platform",
    "venture capital",
    "government funding",
    "startup grants",
    "investor database",
    "raise capital"
  ],
  openGraph: {
    title: "VC Friend - Free Startup Fundraising Platform",
    description: "Discover active venture capital firms, search 220+ government funding schemes, and pitch your ideas to verified investors completely free.",
    url: "https://www.vcfriend.online",
    siteName: "VC Friend",
    images: [
      {
        url: "https://www.vcfriend.online/images/logo.png",
        width: 352,
        height: 352,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "PjoNq-gpk52sBARPwlBixfWfrvZfH4Pec1htoZ588i0",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2a33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a href="#main" className="skip-link">Skip to content</a>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8G4HXYPJ5J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8G4HXYPJ5J');
          `}
        </Script>

        {/* JSON-LD Structured Data Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "VC Friend",
              "operatingSystem": "All",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A free, community-driven platform that helps startup founders discover venture capital firms and search 220+ government funding schemes.",
              "url": "https://www.vcfriend.online"
            })
          }}
        />

        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

