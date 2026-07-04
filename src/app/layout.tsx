import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

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
  title: "VC Friend - Discover Venture Capital Firms",
  description: "A free, community-driven platform that helps startup founders discover venture capital firms actively investing worldwide.",
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
        {/* SVG Filter for realistic rough chalk texture */}
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-0 h-0 pointer-events-none" style={{ visibility: "hidden" }}>
          <defs>
            <filter id="chalk-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <Preloader />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}

