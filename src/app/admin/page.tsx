import { supabase } from "@/lib/supabase";
import { AdminDashboard } from "./AdminDashboard";

export const revalidate = 0; // Dynamic rendering for latest pitches

export default async function AdminPage() {
  // Fetch pitched ideas
  const { data: ideas, error: ideaError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt")
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
