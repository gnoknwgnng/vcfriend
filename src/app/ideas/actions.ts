"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitIdea(formData: FormData) {
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;
  const contactInfo = formData.get("contactInfo") as string;

  if (!content || content.trim() === "") {
    return { error: "Idea content cannot be empty." };
  }

  const { data, error } = await supabase
    .from("IdeaPitch")
    .insert([{ 
      content, 
      authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
      contactInfo: contactInfo && contactInfo.trim() !== "" ? contactInfo.trim() : null
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting idea:", error);
    return { error: "Failed to submit idea. Please try again." };
  }

  revalidatePath("/ideas");
  return { success: true, idea: data };
}

export async function submitIdeaComment(ideaId: string, formData: FormData) {
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;

  if (!content || content.trim() === "") {
    return { error: "Comment content cannot be empty." };
  }

  const { data, error } = await supabase
    .from("IdeaComment")
    .insert([{ 
      ideaId,
      content, 
      authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder" 
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting comment:", error);
    return { error: "Failed to submit comment. Please try again." };
  }

  revalidatePath(`/ideas/${ideaId}`);
  return { success: true, comment: data };
}
