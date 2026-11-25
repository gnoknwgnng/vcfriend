"use server";

import { supabase } from "@/lib/supabase";
import { parseReview } from "@/lib/reviews";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitTestimonial(formData: FormData) {
  const parsed = await parseReview(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }
  const { authorName, content, rating } = parsed.review;

  // The same text cannot be posted twice.
  const { data: existing, error: dupError } = await supabase
    .from("WebsiteReview")
    .select("id")
    .eq("content", content)
    .limit(1);

  if (dupError) {
    console.error("Error checking duplicate testimonial:", dupError);
  } else if (existing && existing.length > 0) {
    return { error: "This review has already been submitted." };
  }

  const { error } = await supabase
    .from("WebsiteReview")
    .insert([{
      authorName,
      content,
      rating,
    }]);

  if (error) {
    console.error("Error submitting testimonial:", error);
    return { error: "Failed to submit review. Please try again." };
  }

  revalidatePath("/"); // Revalidate the landing page
  redirect("/?testimonial=success");
}
