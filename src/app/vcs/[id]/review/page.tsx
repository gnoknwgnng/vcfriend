import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/10 animate-fade-in">
      <Card className="w-full max-w-2xl glass border-border/50 shadow-2xl">
        <VCReviewForm vcId={id} vcName={vc.name} />
      </Card>
    </div>
  );
}
