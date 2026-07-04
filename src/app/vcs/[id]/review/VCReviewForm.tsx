"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitVCReview } from "./actions";

interface VCReviewFormProps {
  vcId: string;
  vcName: string;
}

export function VCReviewForm({ vcId, vcName }: VCReviewFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await submitVCReview(formData, vcId);
    setIsLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-center">Review {vcName}</CardTitle>
        <CardDescription className="text-center text-lg">
          Share your fundraising or meeting experience with this firm to help other founders.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        
        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 font-bold leading-normal">
            ❌ {errorMsg}
          </div>
        )}

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
        <Link href={`/vcs/${vcId}`} className={buttonVariants({ variant: "ghost", className: "w-full sm:w-auto h-12" })}>
          Cancel
        </Link>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto text-base h-12 rounded-full font-semibold px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </CardFooter>
    </form>
  );
}
