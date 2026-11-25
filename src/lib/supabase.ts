import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// The service-role key never leaves the server (this module is server-only).
// When it is set, every query below bypasses Row Level Security, which lets
// the public anon key be locked down to read-only in Supabase. Until it is
// set we fall back to the anon key so the app keeps working as before.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL and a Supabase key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set. Every database query will fail until they are configured."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseKey || "placeholder-anon-key",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
