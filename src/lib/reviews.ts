import "server-only";
import { moderateContent } from "@/lib/moderation";

export const MAX_REVIEW_LENGTH = 3000;
export const MAX_REVIEW_NAME_LENGTH = 80;

export interface ReviewInput {
  authorName: string;
  content: string;
  rating: number;
}

function textField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates and moderates a star review submitted through a form.
 * Shared by the platform testimonial form and the per-VC review form.
 */
export async function parseReview(
  formData: FormData
): Promise<{ review: ReviewInput } | { error: string }> {
  const authorName = textField(formData, "authorName") || "Anonymous Founder";
  const content = textField(formData, "content");
  const rating = Number.parseInt(textField(formData, "rating") || "5", 10);

  if (content === "") {
    return { error: "Review content cannot be empty." };
  }
  if (content.length > MAX_REVIEW_LENGTH) {
    return { error: `Your review is too long. Please keep it under ${MAX_REVIEW_LENGTH.toLocaleString()} characters.` };
  }
  if (authorName.length > MAX_REVIEW_NAME_LENGTH) {
    return { error: `Name must be ${MAX_REVIEW_NAME_LENGTH} characters or fewer.` };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating between 1 and 5." };
  }

  const moderation = await moderateContent(content, "review");
  if (moderation.isSpam) {
    return { error: `Review blocked by AI: ${moderation.reason || "Content does not look like a genuine review."}` };
  }

  return { review: { authorName, content, rating } };
}
