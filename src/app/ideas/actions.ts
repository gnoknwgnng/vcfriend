"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendPushNotification } from "./push-actions";

async function moderatePitchWithAI(content: string): Promise<{ isSpam: boolean; reason?: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not configured. Skipping AI moderation.");
    return { isSpam: false };
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are an AI content moderator for 'VC Friend', a startup pitching platform.
Your task is to analyze the text and determine if it is a legitimate startup pitch or if it is spam/advertisement/malicious content/gibberish.

Criteria for a legitimate pitch:
- Explains a business idea, product, service, startup, or problem they want to solve.
- E.g. "I am building X to solve Y..." or "Looking for feedback on a SaaS tool that..."

Criteria for SPAM (isSpam = true):
- General chat, testing, gibberish (e.g. "asdf", "hello test", "123").
- Direct advertisements for WhatsApp groups, Telegram channels, marketing agencies, or unrelated services (e.g., "Get free leads, WhatsApp me at X...").
- Off-topic rants, spam links, insults, or harassment.

Respond ONLY with a JSON object in this format:
{
  "isSpam": true/false,
  "reason": "Brief explanation of why it was classified as spam (only if isSpam is true)"
}`
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      return { isSpam: false };
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error in AI moderation:", error);
    return { isSpam: false };
  }
}

export async function submitIdea(formData: FormData) {
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;
  const contactInfo = formData.get("contactInfo") as string;

  if (!content || content.trim() === "") {
    return { error: "Idea content cannot be empty." };
  }

  // 1. Enforce IP Rate Limiting (Max 2 lifetime submissions)
  let ip = "127.0.0.1";
  try {
    const headersList = await headers();
    const rawIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";
    ip = rawIp.split(",")[0].trim();
  } catch (e) {
    console.error("Failed to parse headers/IP:", e);
  }

  // Count existing submissions from this IP
  const { count, error: countError } = await supabase
    .from("IdeaPitch")
    .select("*", { count: "exact", head: true })
    .eq("ipAddress", ip);

  if (countError) {
    console.error("Error checking IP submission count:", countError);
  } else if (count && count >= 2) {
    // Save to Spams table (fails silently if table is not created yet)
    try {
      await supabase
        .from("Spams")
        .insert([{ 
          content, 
          authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
          contactInfo: contactInfo && contactInfo.trim() !== "" ? contactInfo.trim() : null,
          ipAddress: ip,
          flaggedReason: "IP Rate Limit Exceeded (Max 2 lifetime submissions)"
        }]);
    } catch (err) {
      console.error("Failed to log spam (rate limit):", err);
    }
    return { error: "You have reached the maximum limit of 2 pitches per device/IP address." };
  }

  // 2. Enforce AI Moderation (Groq Cloud)
  const moderation = await moderatePitchWithAI(content);
  if (moderation.isSpam) {
    // Save to Spams table (fails silently if table is not created yet)
    try {
      await supabase
        .from("Spams")
        .insert([{ 
          content, 
          authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
          contactInfo: contactInfo && contactInfo.trim() !== "" ? contactInfo.trim() : null,
          ipAddress: ip,
          flaggedReason: `AI Moderation Blocked: ${moderation.reason || "Content does not look like a startup pitch."}`
        }]);
    } catch (err) {
      console.error("Failed to log spam (AI moderation):", err);
    }
    return { error: `Submission blocked by AI: ${moderation.reason || "Content does not look like a startup pitch."}` };
  }

  const { data, error } = await supabase
    .from("IdeaPitch")
    .insert([{ 
      content, 
      authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
      contactInfo: contactInfo && contactInfo.trim() !== "" ? contactInfo.trim() : null,
      ipAddress: ip
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

  const trimmedContent = content.trim();

  // 1. Duplicate check (prevent identical comments on the same pitch thread)
  const { data: existingComments, error: dupError } = await supabase
    .from("IdeaComment")
    .select("id")
    .eq("ideaId", ideaId)
    .eq("content", trimmedContent)
    .limit(1);

  if (dupError) {
    console.error("Error checking duplicate comment:", dupError);
  } else if (existingComments && existingComments.length > 0) {
    return { error: "This feedback/comment has already been posted on this pitch." };
  }

  // 2. IP Rate Limit for public comments (max 3 comments per IP per pitch thread)
  let ip = "127.0.0.1";
  try {
    const headersList = await headers();
    const rawIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";
    ip = rawIp.split(",")[0].trim();
  } catch (e) {
    console.error("Failed to parse headers/IP for comment:", e);
  }

  const { count, error: countError } = await supabase
    .from("IdeaComment")
    .select("*", { count: "exact", head: true })
    .eq("ideaId", ideaId)
    .eq("ipAddress", ip);

  if (countError) {
    console.error("Error checking IP comment count:", countError);
  } else if (count && count >= 3) {
    // Save to Spams table (fails silently if table is not created yet)
    try {
      await supabase
        .from("Spams")
        .insert([{ 
          content: trimmedContent, 
          authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
          ipAddress: ip,
          flaggedReason: "IP Rate Limit Exceeded (Max 3 comments per pitch)"
        }]);
    } catch (err) {
      console.error("Failed to log comment rate limit:", err);
    }
    return { error: "You have reached the maximum limit of 3 replies/feedbacks per pitch." };
  }

  // 3. AI Moderation Check (Groq Cloud)
  const moderation = await moderatePitchWithAI(trimmedContent);
  if (moderation.isSpam) {
    // Save to Spams table (fails silently if table is not created yet)
    try {
      await supabase
        .from("Spams")
        .insert([{ 
          content: trimmedContent, 
          authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
          ipAddress: ip,
          flaggedReason: `AI Moderation Blocked Comment: ${moderation.reason || "gibberish or promotional content"}`
        }]);
    } catch (err) {
      console.error("Failed to log comment AI block:", err);
    }
    return { error: `Comment blocked by AI: ${moderation.reason || "Content does not look like a startup feedback."}` };
  }

  const { data, error } = await supabase
    .from("IdeaComment")
    .insert([{ 
      ideaId,
      content: trimmedContent, 
      authorName: authorName && authorName.trim() !== "" ? authorName.trim() : "Anonymous Founder",
      ipAddress: ip
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting comment:", error);
    return { error: "Failed to submit comment. Please try again." };
  }

  revalidatePath(`/ideas/${ideaId}`);

  // Fire push notification to pitch author subscribers (non-blocking)
  sendPushNotification(ideaId, authorName || "Someone", trimmedContent).catch(() => {});

  return { success: true, comment: data };
}

export async function submitVCComment(ideaId: string, vcName: string, content: string) {
  if (!vcName || vcName.trim() === "") {
    return { error: "VC Firm name cannot be empty." };
  }

  if (!content || content.trim() === "") {
    return { error: "Review content cannot be empty." };
  }

  const { data, error } = await supabase
    .from("IdeaComment")
    .insert([{
      ideaId,
      content: content.trim(),
      authorName: `${vcName.trim()} (Investor)`,
      isVC: true
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting VC comment:", error);
    return { error: "Failed to post VC review. Please try again." };
  }

  revalidatePath(`/ideas/${ideaId}`);

  // Fire push notification to pitch author subscribers (non-blocking)
  sendPushNotification(ideaId, `${vcName.trim()} (Investor)`, content.trim()).catch(() => {});

  return { success: true, comment: data };
}
