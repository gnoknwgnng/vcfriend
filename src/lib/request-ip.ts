import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client IP from the proxy headers.
 * Returns null when it cannot be determined, so callers can skip IP-based
 * limits instead of lumping every unknown visitor into one shared bucket.
 */
export async function getClientIp(): Promise<string | null> {
  try {
    const headersList = await headers();
    const raw = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const ip = raw?.split(",")[0]?.trim();
    return ip ? ip.slice(0, 64) : null;
  } catch (e) {
    console.error("Failed to read client IP from headers:", e);
    return null;
  }
}
