import { supabase } from "@/lib/supabase";
import { AdminDashboard } from "./AdminDashboard";

export const revalidate = 0; // Dynamic rendering for latest pitches

export default async function AdminPage() {
  // 1. Fetch active VC Firms
  const { data: vcs, error: vcError } = await supabase
    .from("VC")
    .select("id, name")
    .order("name", { ascending: true });

  if (vcError) {
    console.error("Error fetching VCs for admin:", vcError);
  }

  // 2. Fetch pitched ideas
  const { data: ideas, error: ideaError } = await supabase
    .from("IdeaPitch")
    .select("id, authorName, content, createdAt")
    .order("createdAt", { ascending: false });

  if (ideaError) {
    console.error("Error fetching ideas for admin:", ideaError);
  }

  return (
    <AdminDashboard 
      vcs={vcs || []} 
      ideas={ideas || []} 
    />
  );
}
