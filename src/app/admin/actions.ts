"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendPushNotification } from "@/lib/push";
import {
  checkPasscode,
  clearAdminSession,
  createAdminSession,
  isAdmin,
  isAdminConfigured,
} from "@/lib/admin-auth";

const MAX_VC_NAME = 80;
const MAX_REVIEW = 4000;

export async function adminLogin(formData: FormData) {
  if (!isAdminConfigured()) {
    return { error: "Admin access is not configured on this server yet." };
  }

  const passcode = formData.get("passcode");
  if (typeof passcode !== "string" || !checkPasscode(passcode)) {
    // Slow down guessing a little
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Incorrect passcode. Please try again." };
  }

  await createAdminSession();
  revalidatePath("/admin");
  return { success: true };
}

export async function adminLogout() {
  await clearAdminSession();
  revalidatePath("/admin");
  return { success: true };
}

export async function submitVCComment(ideaId: string, vcName: string, content: string) {
  // Server Functions are reachable by direct POST, so the check lives here,
  // not only in the dashboard UI.
  if (!(await isAdmin())) {
    return { error: "Your admin session has expired. Please log in again." };
  }

  if (typeof ideaId !== "string" || ideaId.trim() === "") {
    return { error: "Missing pitch reference." };
  }

  const name = typeof vcName === "string" ? vcName.trim() : "";
  const review = typeof content === "string" ? content.trim() : "";

  if (name === "") {
    return { error: "VC Firm name cannot be empty." };
  }
  if (name.length > MAX_VC_NAME) {
    return { error: `VC Firm name must be ${MAX_VC_NAME} characters or fewer.` };
  }
  if (review === "") {
    return { error: "Review content cannot be empty." };
  }
  if (review.length > MAX_REVIEW) {
    return { error: `Review must be ${MAX_REVIEW.toLocaleString()} characters or fewer.` };
  }

  const authorName = `${name} (Investor)`;

  const { data, error } = await supabase
    .from("IdeaComment")
    .insert([{
      ideaId,
      content: review,
      authorName,
      isVC: true,
    }])
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting VC comment:", error);
    return { error: "Failed to post VC review. Please try again." };
  }

  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/ideas");

  // Runs after the response is sent, and is kept alive by the platform.
  after(() => sendPushNotification(ideaId, authorName, review));

  return { success: true, commentId: data.id };
}
