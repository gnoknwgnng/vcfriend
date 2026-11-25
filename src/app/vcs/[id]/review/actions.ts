"use server";

import { supabase } from "@/lib/supabase";
import { parseReview } from "@/lib/reviews";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitVCReview(formData: FormData, vcId: string) {
  if (typeof vcId !== "string" || vcId.trim() === "") {
    return { error: "Missing firm reference." };
  }

  const parsed = await parseReview(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }
  const { authorName, content, rating } = parsed.review;

  // The firm must exist.
  const { data: vc, error: vcError } = await supabase
    .from("VC")
    .select("id")
    .eq("id", vcId)
    .maybeSingle();

  if (vcError || !vc) {
    return { error: "We couldn't find that firm. Please go back and try again." };
  }

  // The same text cannot be posted twice on the same firm.
  const { data: existing, error: dupError } = await supabase
    .from("VCReview")
    .select("id")
    .eq("vcId", vcId)
    .eq("content", content)
    .limit(1);

  if (dupError) {
    console.error("Error checking duplicate VC review:", dupError);
  } else if (existing && existing.length > 0) {
    return { error: "This review has already been submitted for this firm." };
  }

  const { error } = await supabase
    .from("VCReview")
    .insert([{
      vcId,
      authorName,
      content,
      rating,
    }]);

  if (error) {
    console.error("Error submitting VC review:", error);
    return { error: "Failed to submit review. Please try again." };
  }

  // Keep the firm's stored average in step with its reviews, so the
  // directory cards show a rating. Best effort: the profile page also
  // computes the average straight from the reviews.
  const { data: ratings, error: ratingsError } = await supabase
    .from("VCReview")
    .select("rating")
    .eq("vcId", vcId);

  if (ratingsError) {
    console.error("Error reading ratings for VC:", ratingsError);
  } else if (ratings && ratings.length > 0) {
    const values = ratings.map((r) => Number(r.rating)).filter((n) => Number.isFinite(n));
    if (values.length > 0) {
      const average = Math.round((values.reduce((sum, n) => sum + n, 0) / values.length) * 10) / 10;
      const { error: updateError } = await supabase.from("VC").update({ rating: average }).eq("id", vcId);
      if (updateError) {
        console.error("Error updating VC rating:", updateError);
      }
    }
  }

  revalidatePath(`/vcs/${vcId}`);
  revalidatePath("/vcs");
  redirect(`/vcs/${vcId}?review=success`);
}
