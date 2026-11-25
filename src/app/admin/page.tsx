import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export const revalidate = 0; // Dynamic rendering for latest pitches

export const metadata: Metadata = {
  title: "Investor Admin - VC Friend",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Checked on the server: nothing about the pitches is sent to the browser
  // until the visitor holds a valid admin session cookie.
  if (!(await isAdmin())) {
    return <AdminLogin configured={isAdminConfigured()} />;
  }

  const { data: ideas, error: ideaError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt, contactInfo")
    .order("createdAt", { ascending: false });

  if (ideaError) {
    console.error("Error fetching ideas for admin:", ideaError);
  }

  return (
    <AdminDashboard
      ideas={ideas || []}
    />
  );
}
