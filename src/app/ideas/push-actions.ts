"use server";

import { supabase } from "@/lib/supabase";

interface PushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const MAX_MATCHED_PITCHES = 20;

function isValidSubscription(sub: PushSubscriptionInput | null | undefined): sub is PushSubscriptionInput {
  if (!sub || typeof sub.endpoint !== "string" || typeof sub.p256dh !== "string" || typeof sub.auth !== "string") {
    return false;
  }
  if (sub.endpoint.length > 2048 || sub.p256dh.length > 512 || sub.auth.length > 512) return false;
  if (!sub.p256dh || !sub.auth) return false;
  try {
    return new URL(sub.endpoint).protocol === "https:";
  } catch {
    return false;
  }
}

/** Escapes the LIKE wildcards so the value is matched literally (case-insensitively). */
function escapeLike(value: string): string {
  return value.replace(/[\\_]/g, (char) => `\\${char}`);
}

/**
 * Save a push subscription for a pitch.
 *
 * - Right after submitting, the form passes the new pitch's id, so the
 *   subscription is tied to exactly that pitch (this also works for
 *   anonymous founders).
 * - Returning founders can instead give the exact name or phone number they
 *   used when pitching.
 */
export async function savePushSubscription(
  nameOrPhone: string,
  subscription: PushSubscriptionInput,
  ideaId?: string
) {
  if (!isValidSubscription(subscription)) {
    return { error: "This browser did not provide a valid notification subscription. Please try again." };
  }

  let pitchIds: string[] = [];

  if (typeof ideaId === "string" && ideaId.trim() !== "") {
    const { data: pitch, error } = await supabase
      .from("IdeaPitch")
      .select("id")
      .eq("id", ideaId.trim())
      .maybeSingle();

    if (error || !pitch) {
      return { error: "We couldn't find that pitch. Please refresh the page and try again." };
    }
    pitchIds = [pitch.id];
  } else {
    const query = typeof nameOrPhone === "string" ? nameOrPhone.trim() : "";
    const notFound = { error: "We couldn't find a pitch with that name or phone number. Please check and try again." };

    if (query === "") {
      return { error: "Please enter your name or phone number used when submitting your pitch." };
    }
    // Wildcards would match other founders' pitches, and the default name is
    // shared by every anonymous pitch, so neither identifies one founder.
    if (query.length > 80 || /[*%]/.test(query) || query.toLowerCase() === "anonymous founder") {
      return notFound;
    }

    // Two separate, parameterised filters: the input is never spliced into a
    // PostgREST filter string.
    const [byName, byPhone] = await Promise.all([
      supabase.from("IdeaPitch").select("id").ilike("authorName", escapeLike(query)).limit(MAX_MATCHED_PITCHES),
      supabase.from("IdeaPitch").select("id").eq("contactInfo", query).limit(MAX_MATCHED_PITCHES),
    ]);

    if (byName.error || byPhone.error) {
      console.error("Error looking up pitches for push subscription:", byName.error || byPhone.error);
      return { error: "Something went wrong while looking up your pitch. Please try again." };
    }

    pitchIds = [...new Set([...(byName.data ?? []), ...(byPhone.data ?? [])].map((p) => p.id as string))]
      .slice(0, MAX_MATCHED_PITCHES);

    if (pitchIds.length === 0) {
      return notFound;
    }
  }

  const { error: insertError } = await supabase
    .from("PushSubscription")
    .upsert(
      pitchIds.map((id) => ({
        ideaId: id,
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      })),
      { onConflict: "endpoint,ideaId" }
    );

  if (insertError) {
    console.error("Error saving push subscription:", insertError);
    return { error: "We couldn't save your notification settings. Please try again later." };
  }

  return { success: true, pitchCount: pitchIds.length };
}
