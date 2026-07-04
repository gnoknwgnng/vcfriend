import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesHighlight } from "@/components/landing/FeaturesHighlight";
import { FounderStories } from "@/components/landing/FounderStories";
import { SocialProof } from "@/components/landing/SocialProof";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every minute

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const isSuccess = params.testimonial === 'success';

  // Fetch website testimonials
  const { data: testimonials } = await supabase
    .from("WebsiteReview")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(6);

  // Fetch total reviews count
  const { count: reviewsCount } = await supabase
    .from("WebsiteReview")
    .select('*', { count: 'exact', head: true });

  // Fetch latest ideas
  const { data: latestIdeas } = await supabase
    .from("IdeaPitch")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col items-center bg-book-texture min-h-screen relative overflow-hidden">
      <div className="relative z-10 w-full flex flex-col items-center">
        {isSuccess && (
        <div className="w-full bg-emerald-600 text-white text-center py-3 px-4 font-medium animate-in slide-in-from-top fade-in duration-500 shadow-md sticky top-0 z-50">
          Thank you for your review! Your feedback has been published.
        </div>
      )}

      {/* 1. Hero Section (Animated, Interactive) */}
      <HeroSection />

      {/* 2. Inspirational Founder Stories (Parallax, Scroll Triggers) */}
      <FounderStories />

      {/* 3. Core Features Highlight */}
      <FeaturesHighlight />

      {/* 4. Social Proof & Statistics */}
      <SocialProof 
        testimonials={testimonials || []} 
        latestIdeas={latestIdeas || []} 
        reviewsCount={reviewsCount || 0} 
      />

      {/* 5. FAQ Section */}
      <FAQSection />

      {/* 6. Strong CTA Section */}
      <CTASection />

      {/* 7. Footer */}
        <Footer />
      </div>
    </div>
  );
}
