import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased bg-gray-50`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
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

        {/* SVG Filter for realistic rough chalk texture */}
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-0 h-0 pointer-events-none" style={{ visibility: "hidden" }}>
          <defs>
            <filter id="chalk-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

