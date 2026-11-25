import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "vcf_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

/** The admin passcode lives only in the server environment (ADMIN_PASSCODE). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSCODE);
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSCODE || "";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

function digest(value: string): Buffer {
  return createHmac("sha256", "vcf-admin-compare").update(value).digest();
}

/** Constant-time passcode check. Always false when no passcode is configured. */
export function checkPasscode(input: string): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || typeof input !== "string") return false;
  return timingSafeEqual(digest(input), digest(expected));
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** True only for a request carrying a valid, unexpired, signed admin cookie. */
export async function isAdmin(): Promise<boolean> {
  if (!sessionSecret()) return false;
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature) return false;

  const expected = Buffer.from(sign(expiresAt));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}
