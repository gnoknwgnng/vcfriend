"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Preloader } from "../ui/Preloader";
import { SmoothScroll } from "../ui/SmoothScroll";
import { Footer } from "../landing/Footer";
import { ScrollProgress, BackToTop } from "../ui/Reveal";
import React, { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add("admin-body-override");
    } else {
      document.body.classList.remove("admin-body-override");
    }
    return () => {
      document.body.classList.remove("admin-body-override");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <main id="main" className="flex-1 flex flex-col min-h-screen bg-mist text-ink font-sans">
        {children}
      </main>
    );
  }

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <SmoothScroll>
        <Navbar />
        <main id="main" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
      <BackToTop />
    </>
  );
}
