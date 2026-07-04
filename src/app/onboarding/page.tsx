"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    stage: "",
    sector: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query parameters to pass to the VC Directory
    const params = new URLSearchParams();
    if (formData.stage) params.append("stage", formData.stage);
    if (formData.sector) params.append("sector", formData.sector);
    
    // Redirect to VC directory with filters applied
    router.push(`/vcs?${params.toString()}`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="w-full max-w-2xl mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
      </div>
      <Card className="w-full max-w-2xl glass border-border/50 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Tell us about your startup</CardTitle>
          <CardDescription className="text-center text-lg">
            We will use this to find the perfect investors for you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                placeholder="Acme Corp" 
                className="bg-background/50"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage</Label>
                <Select value={formData.stage} onValueChange={val => setFormData({...formData, stage: val || ""})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Idea or Patent">Idea or Patent</SelectItem>
                    <SelectItem value="Prototype">Prototype</SelectItem>
                    <SelectItem value="Early Revenue">Early Revenue</SelectItem>
                    <SelectItem value="Scaling">Scaling</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Pre-IPO">Pre-IPO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={formData.sector} onValueChange={val => setFormData({...formData, sector: val || ""})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Sectors">All Sectors</SelectItem>
                    <SelectItem value="SaaS / Enterprise Software">SaaS / Enterprise Software</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="AI / Machine Learning">AI / Machine Learning</SelectItem>
                    <SelectItem value="Healthcare / HealthTech">Healthcare / HealthTech</SelectItem>
                    <SelectItem value="Climate / CleanTech / Energy">Climate / CleanTech / Energy</SelectItem>
                    <SelectItem value="Deep Tech / Hardware">Deep Tech / Hardware</SelectItem>
                    <SelectItem value="Consumer / Consumer Internet">Consumer / Consumer Internet</SelectItem>
                    <SelectItem value="Web3 / Blockchain / Crypto">Web3 / Blockchain / Crypto</SelectItem>
                    <SelectItem value="Generalist / Sector-Agnostic">Generalist / Sector-Agnostic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg h-12 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              Find Matching Investors
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
