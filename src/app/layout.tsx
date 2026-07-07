import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/ui/Preloader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
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
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </SmoothScroll>

        {/* Realistic Chalkboard Border Frame Overlay */}
        <div className="pointer-events-none fixed inset-0 z-40">
          {/* Left Border */}
          <div 
            className="absolute left-0 top-0 bottom-0 shadow-lg border-r border-slate-400/30"
            style={{ 
              width: 'var(--board-frame-thickness)',
              backgroundImage: 'linear-gradient(to right, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
            }}
          />
          {/* Right Border */}
          <div 
            className="absolute right-0 top-0 bottom-0 shadow-lg border-l border-slate-400/30"
            style={{ 
              width: 'var(--board-frame-thickness)',
              backgroundImage: 'linear-gradient(to left, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
            }}
          />
          {/* Top Border */}
          <div 
            className="absolute top-0 left-0 right-0 shadow-md border-b border-slate-400/30"
            style={{ 
              height: 'var(--board-frame-thickness)',
              backgroundImage: 'linear-gradient(to bottom, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
            }}
          />
          {/* Bottom Border */}
          <div 
            className="absolute bottom-0 left-0 right-0 shadow-md border-t border-slate-400/30"
            style={{ 
              height: 'var(--board-frame-thickness)',
              backgroundImage: 'linear-gradient(to top, #cfd8dc 0%, #eceff1 25%, #b0bec5 50%, #90a4ae 75%, #78909c 100%)' 
            }}
          />
          
          {/* Inner rubber seal gasket (thin dark shadow line) */}
          <div 
            className="absolute pointer-events-none inset-0 border border-black/40"
            style={{ margin: 'var(--board-frame-thickness)' }}
          />

          {/* Corners (Black brackets) */}
          <div 
            className="absolute top-0 left-0 bg-[#262626] border border-neutral-700/60 rounded-br-[3px] shadow-[2px_2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in"
            style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
          />
          <div 
            className="absolute top-0 right-0 bg-[#262626] border border-neutral-700/60 rounded-bl-[3px] shadow-[-2px_2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in"
            style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
          />
          <div 
            className="absolute bottom-0 left-0 bg-[#262626] border border-neutral-700/60 rounded-tr-[3px] shadow-[2px_-2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in"
            style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
          />
          <div 
            className="absolute bottom-0 right-0 bg-[#262626] border border-neutral-700/60 rounded-tl-[3px] shadow-[-2px_-2px_4px_rgba(0,0,0,0.3)] z-50 animate-fade-in"
            style={{ width: 'calc(var(--board-frame-thickness) * 1.6)', height: 'calc(var(--board-frame-thickness) * 1.6)' }}
          />
        </div>
      </body>
    </html>
  );
}

