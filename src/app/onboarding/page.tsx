"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";

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
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-16 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to home
        </Link>

        <Reveal effect="scale" className="mt-6 surface overflow-hidden">
          <div className="p-7 md:p-10 border-b border-line">
            <div className="w-12 h-12 rounded-2xl bg-teal-light text-teal-deep flex items-center justify-center mb-5">
              <Building2 className="w-5.5 h-5.5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink leading-tight">
              Tell us about your startup
            </h1>
            <p className="mt-2 text-base md:text-lg text-ink-soft">
              We will use this to find the perfect investors for you.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-7 md:p-10 space-y-6">
              <div>
                <label htmlFor="companyName" className="field-label">Company name</label>
                <input
                  id="companyName"
                  placeholder="Acme Corp"
                  className="field"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="stage" className="field-label">Current stage</label>
                  <select
                    id="stage"
                    className="field"
                    value={formData.stage}
                    onChange={e => setFormData({...formData, stage: e.target.value || ""})}
                  >
                    <option value="">Select stage</option>
                    <option value="Idea or Patent">Idea or Patent</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Scaling">Scaling</option>
                    <option value="Growth">Growth</option>
                    <option value="Pre-IPO">Pre-IPO</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sector" className="field-label">Sector</label>
                  <select
                    id="sector"
                    className="field"
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value || ""})}
                  >
                    <option value="">Select sector</option>
                    <option value="All Sectors">All Sectors</option>
                    <option value="SaaS / Enterprise Software">SaaS / Enterprise Software</option>
                    <option value="Fintech">Fintech</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Healthcare / HealthTech">Healthcare / HealthTech</option>
                    <option value="Climate / CleanTech / Energy">Climate / CleanTech / Energy</option>
                    <option value="Deep Tech / Hardware">Deep Tech / Hardware</option>
                    <option value="Consumer / Consumer Internet">Consumer / Consumer Internet</option>
                    <option value="Web3 / Blockchain / Crypto">Web3 / Blockchain / Crypto</option>
                    <option value="Generalist / Sector-Agnostic">Generalist / Sector-Agnostic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-7 md:px-10 py-6 bg-mist/70 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Leave stage or sector blank to browse every firm.
              </p>
              <button type="submit" className="btn btn-coral group">
                Find matching investors
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
