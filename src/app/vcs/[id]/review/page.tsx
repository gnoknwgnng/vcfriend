import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { VCReviewForm } from "./VCReviewForm";

export default async function VCReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch the VC to make sure it exists and to get the name
  const { data: vc, error } = await supabase
    .from("VC")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error || !vc) {
    notFound();
  }

  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-16 max-w-3xl animate-fade-in">
        <VCReviewForm vcId={id} vcName={vc.name} />
      </div>
    </div>
  );
}
