import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitVCReview } from "./actions";

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

  // Create a bound action with the vcId pre-filled
  const submitAction = async (formData: FormData) => {
    "use server";
    await submitVCReview(formData, id);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/10 animate-fade-in">
      <Card className="w-full max-w-2xl glass border-border/50 shadow-2xl">
        <form action={submitAction}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Review {vc.name}</CardTitle>
            <CardDescription className="text-center text-lg">
              Share your fundraising or meeting experience with this firm to help other founders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            
            <div className="space-y-2">
              <label htmlFor="authorName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Name & Company (Optional)
              </label>
              <Input 
                id="authorName"
                name="authorName" 
                placeholder="e.g. Jane Doe, Founder @ StartupX" 
                className="bg-background/50 text-base py-6"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Rating
              </label>
              <select 
                id="rating"
                name="rating" 
                className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="5"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                <option value="4">⭐⭐⭐⭐ (4/5) - Great</option>
                <option value="3">⭐⭐⭐ (3/5) - Good</option>
                <option value="2">⭐⭐ (2/5) - Fair</option>
                <option value="1">⭐ (1/5) - Poor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Review
              </label>
              <Textarea 
                id="content"
                name="content" 
                placeholder="How was your interaction? Were they helpful? Did they invest?" 
                className="min-h-[150px] bg-background/50 resize-y text-base p-4"
                required
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-end mt-4 pb-8">
            <Link href={`/vcs/${id}`} className={buttonVariants({ variant: "ghost", className: "w-full sm:w-auto h-12" })}>
              Cancel
            </Link>
            <Button type="submit" className="w-full sm:w-auto text-base h-12 rounded-full font-semibold px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              Submit Review
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
