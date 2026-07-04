"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitTestimonial(formData: FormData) {
  const authorName = formData.get("authorName") as string;
  const content = formData.get("content") as string;
  const ratingStr = formData.get("rating") as string;
  const rating = ratingStr ? parseInt(ratingStr, 10) : 5;

  if (!content || content.trim() === "") {
    return { error: "Review content cannot be empty." };
  }

  const { error } = await supabase
    .from("WebsiteReview")
    .insert([{ 
      authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
      content,
      rating
    }]);

  if (error) {
    console.error("Error submitting testimonial:", error);
    return { error: "Failed to submit review. Please try again." };
  }

  revalidatePath("/"); // Revalidate the landing page
  redirect("/?testimonial=success");
}
