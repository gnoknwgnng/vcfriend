"use client";

import { useState, useEffect } from "react";
import { submitVCComment } from "../ideas/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

interface VC {
  id: string;
  name: string;
}

interface Idea {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface AdminDashboardProps {
  vcs: VC[];
  ideas: Idea[];
}

export function AdminDashboard({ vcs, ideas }: AdminDashboardProps) {
  const [selectedVcId, setSelectedVcId] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [activeReviews, setActiveReviews] = useState<{ [ideaId: string]: string }>({});
  const [reviewStatus, setReviewStatus] = useState<{ [ideaId: string]: { loading: boolean; error?: string; success?: boolean } }>({});

  // Restore session from localStorage if present
  useEffect(() => {
    const savedVcId = localStorage.getItem("vc_admin_id");
    const savedPasscode = localStorage.getItem("vc_admin_passcode");
    if (savedVcId) setSelectedVcId(savedVcId);
    if (savedPasscode) setPasscode(savedPasscode);
  }, []);

  const saveSession = (vcId: string, code: string) => {
    setSelectedVcId(vcId);
    setPasscode(code);
    localStorage.setItem("vc_admin_id", vcId);
    localStorage.setItem("vc_admin_passcode", code);
  };

  const handleReviewSubmit = async (ideaId: string) => {
    const content = activeReviews[ideaId];
    if (!selectedVcId) {
      alert("Please select your VC Firm first.");
      return;
    }
    if (!passcode) {
      alert("Please enter the investor passcode.");
      return;
    }
    if (!content || content.trim() === "") {
      alert("Review message cannot be empty.");
      return;
    }

    setReviewStatus(prev => ({ ...prev, [ideaId]: { loading: true } }));

    const res = await submitVCComment(ideaId, selectedVcId, passcode, content);

    if (res?.error) {
      setReviewStatus(prev => ({
        ...prev,
        [ideaId]: { loading: false, error: res.error }
      }));
    } else {
      setReviewStatus(prev => ({
        ...prev,
        [ideaId]: { loading: false, success: true }
      }));
      setActiveReviews(prev => ({ ...prev, [ideaId]: "" }));
      
      // Auto clear success indicator after 3 seconds
      setTimeout(() => {
        setReviewStatus(prev => ({
          ...prev,
          [ideaId]: { ...prev[ideaId], success: false }
        }));
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="chalk-heading text-4xl md:text-5xl font-bold tracking-tight mb-2 text-emerald-200">
          VC Investor Portal
        </h1>
        <p className="chalk-text text-lg text-emerald-100/80">
          Select your firm, enter your investor code, and review startup ideas to mark them as verified VC interest.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Investor Authentication / Session settings */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <Card className="glass border-emerald-500/20 shadow-2xl p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Investor Session
              </CardTitle>
              <CardDescription className="text-emerald-200/60">
                Authenticate once to sign reviews on pitches
              </CardDescription>
            </CardHeader>
            
            <div className="space-y-4">
              {/* VC Firm Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/80">
                  Select VC Firm
                </label>
                <select
                  value={selectedVcId}
                  onChange={(e) => saveSession(e.target.value, passcode)}
                  className="flex h-12 w-full rounded-md border border-emerald-500/20 bg-emerald-950/40 text-emerald-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="" className="bg-emerald-950 text-emerald-100">-- Choose your Firm --</option>
                  {vcs.map((vc) => (
                    <option key={vc.id} value={vc.id} className="bg-emerald-950 text-emerald-100">
                      {vc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passcode Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/80">
                  Investor Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => saveSession(selectedVcId, e.target.value)}
                  placeholder="Enter passcode (e.g. vcfriend)"
                  className="flex h-12 w-full rounded-md border border-emerald-500/20 bg-emerald-950/40 text-emerald-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder-emerald-200/30"
                />
              </div>

              <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-md text-[11px] text-emerald-200/80 leading-normal font-semibold">
                ℹ️ **Passcode Notice:** The default passcode is `vcfriend`. Any reviews posted with this credential will be highlighted and labeled with your firm's name.
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Ideas Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="chalk-heading text-2xl font-bold tracking-tight text-emerald-200 mb-4">
            Recent Startup Pitches ({ideas.length})
          </h2>

          {ideas.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-emerald-500/20 rounded-sm">
              <p className="chalk-text text-xl">No pitches found in database.</p>
            </div>
          ) : (
            ideas.map((idea) => {
              const reviewState = reviewStatus[idea.id] || { loading: false };
              return (
                <div 
                  key={idea.id}
                  className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-xl rotate-[0.2deg]"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  {/* Pin */}
                  <div className="absolute -top-2.5 left-6 w-5 h-5 rounded-full bg-red-400 border-2 border-white shadow-sm z-10" />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="font-bold text-lg text-slate-900">{idea.authorName || "Anonymous Founder"}</span>
                      <span className="text-[12px] font-semibold text-slate-500 ml-2">
                        Pitched {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      href={`/ideas/${idea.id}`}
                      target="_blank"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                    >
                      Open Feed Thread
                    </Link>
                  </div>

                  {/* Pitch Content */}
                  <p className="text-slate-800 text-[16px] leading-relaxed mb-6 font-bold">
                    {idea.content}
                  </p>

                  {/* VC Review Editor */}
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-slate-100 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      ✍️ Post VC Review / Feedback
                    </label>
                    <textarea
                      value={activeReviews[idea.id] || ""}
                      onChange={(e) => setActiveReviews(prev => ({ ...prev, [idea.id]: e.target.value }))}
                      placeholder="Enter feedback to highlight this pitch..."
                      className="w-full min-h-[80px] bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 p-3 text-base font-semibold focus:outline-none focus:border-slate-400 resize-y rounded-sm"
                    />

                    {/* Status Alerts */}
                    {reviewState.error && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 font-bold">
                        ❌ {reviewState.error}
                      </div>
                    )}
                    {reviewState.success && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 font-bold">
                        ✅ Review submitted and highlighted on feed!
                      </div>
                    )}

                    <button
                      onClick={() => handleReviewSubmit(idea.id)}
                      disabled={reviewState.loading}
                      className="inline-flex items-center justify-center px-4 h-10 rounded-sm border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50"
                    >
                      {reviewState.loading ? "Posting..." : "Post Highlighted Review"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
