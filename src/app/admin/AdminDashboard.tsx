"use client";

import { useState, useEffect } from "react";
import { submitVCComment } from "../ideas/actions";
import { ChevronLeft, Award } from "lucide-react";
import Link from "next/link";

interface Idea {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface AdminDashboardProps {
  ideas: Idea[];
}

export function AdminDashboard({ ideas }: AdminDashboardProps) {
  const [vcName, setVcName] = useState<string>("");
  const [activeReviews, setActiveReviews] = useState<{ [ideaId: string]: string }>({});
  const [reviewStatus, setReviewStatus] = useState<{ [ideaId: string]: { loading: boolean; error?: string; success?: boolean } }>({});
  
  // Passcode gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore VC Name and auth state
  useEffect(() => {
    const savedVcName = localStorage.getItem("vc_admin_name");
    if (savedVcName) setVcName(savedVcName);

    const isUnlocked = sessionStorage.getItem("admin_portal_unlocked") === "true";
    if (isUnlocked) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleVcNameChange = (name: string) => {
    setVcName(name);
    localStorage.setItem("vc_admin_name", name);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode === "vcfriend") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_portal_unlocked", "true");
      setAuthError(null);
    } else {
      setAuthError("Incorrect passcode. Please try again.");
    }
  };

  const handleReviewSubmit = async (ideaId: string) => {
    const content = activeReviews[ideaId];
    if (!vcName || vcName.trim() === "") {
      alert("Please enter your VC Firm Name on the card.");
      return;
    }
    if (!content || content.trim() === "") {
      alert("Review message cannot be empty.");
      return;
    }

    setReviewStatus(prev => ({ ...prev, [ideaId]: { loading: true } }));

    const res = await submitVCComment(ideaId, vcName, content);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 glass border border-emerald-500/20 p-8 rounded-sm shadow-2xl animate-fade-in text-center">
          <div>
            <h2 className="chalk-heading text-4xl font-bold text-emerald-200 mb-2">
              Portal Locked
            </h2>
            <p className="chalk-text text-emerald-100/60 text-sm">
              Please enter the investor passcode to access the Admin Portal.
            </p>
          </div>
          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <input
              type="password"
              value={inputPasscode}
              onChange={(e) => setInputPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="flex h-12 w-full rounded-sm border border-emerald-500/20 bg-emerald-950/40 text-emerald-100 px-3 py-2 text-center text-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder-emerald-200/25"
              required
            />
            {authError && (
              <p className="text-rose-400 text-sm font-semibold">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 h-12 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Unlock Portal
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-emerald-500/10">
            <Link 
              href="/" 
              className="text-sm font-semibold text-emerald-300 hover:text-emerald-200 underline"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      
      {/* Page Header - Wrapped in blocks to avoid inline overlapping */}
      <div className="border-b border-emerald-500/20 pb-6 mb-8 flex flex-col gap-3">
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-emerald-200 hover:text-emerald-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
        </div>
        <div>
          <h1 className="chalk-heading text-4xl md:text-5xl font-bold tracking-tight text-emerald-200 block">
            Investor Admin Portal
          </h1>
        </div>
        <div>
          <p className="chalk-text text-[15px] text-emerald-100/70 block">
            Review startup ideas, give professional feedback, and highlight them on the platform.
          </p>
        </div>
      </div>

      {/* Grid of Pitches */}
      <div className="space-y-6">
        <div>
          <h2 className="chalk-heading text-2xl font-bold tracking-tight text-emerald-200">
            Recent Startup Pitches ({ideas.length})
          </h2>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-emerald-500/20 rounded-sm bg-emerald-950/10">
            <p className="chalk-text text-2xl">No pitches found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ideas.map((idea) => {
              const reviewState = reviewStatus[idea.id] || { loading: false };
              return (
                <div 
                  key={idea.id}
                  className="relative flex flex-col p-6 rounded-sm border-2 border-slate-200 bg-white shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition-shadow duration-300 rotate-[0.5deg]"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  {/* Pin */}
                  <div className="absolute -top-2.5 left-6 w-5 h-5 rounded-full bg-red-400 border-2 border-white shadow-sm z-10" />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="font-bold text-lg text-slate-900">{idea.authorName || "Anonymous Founder"}</span>
                      <span className="text-[12px] font-semibold text-slate-500 ml-2 animate-pulse">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      href={`/ideas/${idea.id}`}
                      target="_blank"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline shrink-0"
                    >
                      Open Feed
                    </Link>
                  </div>

                  {/* Pitch Content */}
                  <p className="text-slate-800 text-[16px] leading-relaxed mb-6 font-bold flex-grow">
                    {idea.content}
                  </p>

                  {/* VC Review Editor - Redesigned with chalkboard handwritten styles */}
                  <div className="pt-4 border-t-2 border-dashed border-slate-100 space-y-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        Post Verified VC Feedback
                      </span>
                    </div>

                    {/* VC Firm Name Input */}
                    <div className="space-y-1">
                      <input 
                        type="text"
                        value={vcName}
                        onChange={(e) => handleVcNameChange(e.target.value)}
                        placeholder="Your VC Firm Name (e.g. Sequoia Capital)"
                        className="w-full bg-transparent border-b-2 border-dashed border-slate-300 focus:border-slate-500 placeholder-slate-400 text-slate-900 text-base font-bold px-1 py-1.5 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Feedback Content */}
                    <div className="space-y-1">
                      <textarea
                        value={activeReviews[idea.id] || ""}
                        onChange={(e) => setActiveReviews(prev => ({ ...prev, [idea.id]: e.target.value }))}
                        placeholder="Enter professional feedback to highlight this pitch..."
                        className="w-full min-h-[90px] bg-transparent border-2 border-dashed border-slate-200 focus:border-slate-400 placeholder-slate-400 text-slate-900 text-base font-bold p-2.5 focus:outline-none resize-none rounded-sm"
                        required
                      />
                    </div>

                    {/* Status Alerts */}
                    {reviewState.error && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 font-bold">
                        ❌ {reviewState.error}
                      </div>
                    )}
                    {reviewState.success && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 font-bold">
                        ✅ Review submitted and highlighted!
                      </div>
                    )}

                    <button
                      onClick={() => handleReviewSubmit(idea.id)}
                      disabled={reviewState.loading}
                      className="w-full mt-2 inline-flex items-center justify-center px-4 h-11 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      {reviewState.loading ? "Posting..." : "Post Highlighted Review"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
