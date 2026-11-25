import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Turns a loosely formatted website value into a safe absolute http(s) URL.
 * Handles "www.site.com", "Https://site.com" and "https:www.site.com".
 * Returns null for empty or unusable values so callers can hide the link.
 */
export function normalizeExternalUrl(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  let value = raw.trim();
  if (!value) return null;

  // Normalise the scheme: any casing, and any number of slashes after the colon.
  value = value.replace(/^(https?):\/*/i, (_match, scheme: string) => `${scheme.toLowerCase()}://`);
  if (!/^https?:\/\//.test(value)) value = `https://${value}`;

  try {
    const url = new URL(value);
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Parses a ?page= query value into a whole number of at least 1. */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

/** First value of a query param that may arrive as a string or an array. */
export function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
