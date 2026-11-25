"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { supabase } from "@/lib/supabase";
import { moderateContent } from "@/lib/moderation";
import { getClientIp } from "@/lib/request-ip";
import { sendPushNotification } from "@/lib/push";

const DEFAULT_AUTHOR = "Anonymous Founder";

const MAX_PITCH_LENGTH = 5000;
const MAX_COMMENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;
const MAX_CONTACT_LENGTH = 60;

// Pitches allowed per IP address in a rolling 24-hour window. A rolling window
// (rather than a lifetime cap) keeps spam down without permanently locking
// out founders who share an IP on a mobile network, campus or office.
const PITCHES_PER_DAY = 2;
const COMMENTS_PER_PITCH = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

function textField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Records a blocked submission. Never throws: logging must not break the request. */
async function logSpam(entry: {
  content: string;
  authorName: string;
  contactInfo?: string | null;
  ipAddress: string | null;
  flaggedReason: string;
}) {
  try {
    const { error } = await supabase.from("Spams").insert([entry]);
    if (error) console.error("Failed to log spam:", error);
  } catch (err) {
    console.error("Failed to log spam:", err);
  }
}

export async function submitIdea(formData: FormData) {
  const content = textField(formData, "content");
  const authorName = textField(formData, "authorName") || DEFAULT_AUTHOR;
  const contactInfo = textField(formData, "contactInfo") || null;

  if (content === "") {
    return { error: "Idea content cannot be empty." };
  }
  if (content.length > MAX_PITCH_LENGTH) {
    return { error: `Your pitch is too long. Please keep it under ${MAX_PITCH_LENGTH.toLocaleString()} characters.` };
  }
  if (authorName.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (contactInfo && contactInfo.length > MAX_CONTACT_LENGTH) {
    return { error: `Contact info must be ${MAX_CONTACT_LENGTH} characters or fewer.` };
  }

  // 1. Enforce IP rate limiting (skipped when the IP cannot be determined)
  const ip = await getClientIp();

  if (ip) {
    const since = new Date(Date.now() - DAY_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("IdeaPitch")
      .select("id", { count: "exact", head: true })
      .eq("ipAddress", ip)
      .gte("createdAt", since);

    if (countError) {
      console.error("Error checking IP submission count:", countError);
    } else if ((count ?? 0) >= PITCHES_PER_DAY) {
      await logSpam({
        content,
        authorName,
        contactInfo,
        ipAddress: ip,
        flaggedReason: `IP Rate Limit Exceeded (Max ${PITCHES_PER_DAY} pitches per 24 hours)`,
      });
      return {
        error: `You can submit up to ${PITCHES_PER_DAY} pitches every 24 hours from one network. Please try again tomorrow.`,
      };
    }
  }

  // 2. Enforce AI Moderation (Groq Cloud)
  const moderation = await moderateContent(content, "pitch");
  if (moderation.isSpam) {
    const reason = moderation.reason || "Content does not look like a startup pitch.";
    await logSpam({
      content,
      authorName,
      contactInfo,
      ipAddress: ip,
      flaggedReason: `AI Moderation Blocked: ${reason}`,
    });
    return { error: `Submission blocked by AI: ${reason}` };
  }

  const { data, error } = await supabase
    .from("IdeaPitch")
    .insert([{
      content,
      authorName,
      contactInfo,
      ipAddress: ip,
    }])
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting idea:", error);
    return { error: "Failed to submit idea. Please try again." };
  }

  revalidatePath("/ideas");
  revalidatePath("/");
  // Only the id goes back to the browser (never the stored IP address).
  return { success: true, idea: { id: data.id as string } };
}

export async function submitIdeaComment(ideaId: string, formData: FormData) {
  if (typeof ideaId !== "string" || ideaId.trim() === "") {
    return { error: "Missing pitch reference." };
  }

  const content = textField(formData, "content");
  const authorName = textField(formData, "authorName") || DEFAULT_AUTHOR;

  if (content === "") {
    return { error: "Comment content cannot be empty." };
  }
  if (content.length > MAX_COMMENT_LENGTH) {
    return { error: `Your feedback is too long. Please keep it under ${MAX_COMMENT_LENGTH.toLocaleString()} characters.` };
  }
  if (authorName.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  // 1. Duplicate check: the same text cannot be posted twice on the same pitch.
  const { data: existingComments, error: dupError } = await supabase
    .from("IdeaComment")
    .select("id")
    .eq("ideaId", ideaId)
    .eq("content", content)
    .limit(1);

  if (dupError) {
    console.error("Error checking duplicate comment:", dupError);
  } else if (existingComments && existingComments.length > 0) {
    return { error: "This exact feedback has already been posted on this pitch." };
  }

  // 2. IP rate limit for public comments (max 3 comments per IP per pitch thread)
  const ip = await getClientIp();

  if (ip) {
    const { count, error: countError } = await supabase
      .from("IdeaComment")
      .select("id", { count: "exact", head: true })
      .eq("ideaId", ideaId)
      .eq("ipAddress", ip);

    if (countError) {
      console.error("Error checking IP comment count:", countError);
    } else if ((count ?? 0) >= COMMENTS_PER_PITCH) {
      await logSpam({
        content,
        authorName,
        ipAddress: ip,
        flaggedReason: `IP Rate Limit Exceeded (Max ${COMMENTS_PER_PITCH} comments per pitch)`,
      });
      return { error: `You have reached the maximum limit of ${COMMENTS_PER_PITCH} replies/feedbacks per pitch.` };
    }
  }

  // 3. AI Moderation Check (Groq Cloud)
  const moderation = await moderateContent(content, "comment");
  if (moderation.isSpam) {
    await logSpam({
      content,
      authorName,
      ipAddress: ip,
      flaggedReason: `AI Moderation Blocked Comment: ${moderation.reason || "gibberish or promotional content"}`,
    });
    return { error: `Comment blocked by AI: ${moderation.reason || "Content does not look like a startup feedback."}` };
  }

  const { data, error } = await supabase
    .from("IdeaComment")
    .insert([{
      ideaId,
      content,
      authorName,
      ipAddress: ip,
    }])
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting comment:", error);
    return { error: "Failed to submit comment. Please try again." };
  }

  revalidatePath(`/ideas/${ideaId}`);

  // Runs after the response is sent, and is kept alive by the platform.
  after(() => sendPushNotification(ideaId, authorName, content));

  return { success: true, commentId: data.id as string };
}
