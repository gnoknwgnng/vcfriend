"use client";

import { useState, useEffect } from "react";
import { submitVCComment } from "../ideas/actions";
import { ChevronLeft, Award } from "lucide-react";
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
  const [activeReviews, setActiveReviews] = useState<{ [ideaId: string]: string }>({});
  const [reviewStatus, setReviewStatus] = useState<{ [ideaId: string]: { loading: boolean; error?: string; success?: boolean } }>({});

  // Restore selected VC from localStorage if present
  useEffect(() => {
    const savedVcId = localStorage.getItem("vc_admin_id");
    if (savedVcId) setSelectedVcId(savedVcId);
  }, []);

  const handleVcSelect = (vcId: string) => {
    setSelectedVcId(vcId);
    localStorage.setItem("vc_admin_id", vcId);
  };

  const handleReviewSubmit = async (ideaId: string) => {
    const content = activeReviews[ideaId];
    if (!selectedVcId) {
      alert("Please select your VC Firm first at the top of the page.");
      return;
    }
    if (!content || content.trim() === "") {
      alert("Review message cannot be empty.");
      return;
    }

    setReviewStatus(prev => ({ ...prev, [ideaId]: { loading: true } }));

    const res = await submitVCComment(ideaId, selectedVcId, content);

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
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-emerald-500/20 pb-6 mb-8">
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-emerald-200 hover:text-emerald-100 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="chalk-heading text-4xl md:text-5xl font-bold tracking-tight text-emerald-200">
            Investor Admin Portal
          </h1>
          <p className="chalk-text text-[15px] text-emerald-100/70 mt-1">
            Review startup ideas to post verified investor feedback and highlight them on the platform.
          </p>
        </div>

        {/* Firm Select Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-emerald-950/40 border border-emerald-500/25 p-4 rounded-sm shadow-sm w-full md:w-auto max-w-md">
          <div className="text-sm font-bold text-emerald-200 shrink-0">
            Publish reviews on behalf of:
          </div>
          <select
            value={selectedVcId}
            onChange={(e) => handleVcSelect(e.target.value)}
            className="flex h-10 w-full sm:w-60 rounded-sm border border-emerald-500/20 bg-emerald-900/30 text-emerald-100 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 font-bold"
          >
            <option value="" className="bg-emerald-950 text-emerald-100">-- Select VC Firm --</option>
            {vcs.map((vc) => (
              <option key={vc.id} value={vc.id} className="bg-emerald-950 text-emerald-100">
                {vc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Screen Grid Layout */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="chalk-heading text-2xl font-bold tracking-tight text-emerald-200">
            Recent Startup Pitches ({ideas.length})
          </h2>
          {!selectedVcId && (
            <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-sm animate-pulse">
              ⚠️ Please select your VC Firm above to write reviews
            </span>
          )}
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
                      <span className="text-[12px] font-semibold text-slate-500 ml-2">
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
                  <p className="text-slate-800 text-[15px] leading-relaxed mb-6 font-bold flex-grow">
                    {idea.content}
                  </p>

                  {/* VC Review Editor */}
                  <div className="pt-4 border-t-2 border-dashed border-slate-100 space-y-3 mt-auto">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Post Verified VC Feedback
                      </span>
                    </div>
                    <textarea
                      value={activeReviews[idea.id] || ""}
                      onChange={(e) => setActiveReviews(prev => ({ ...prev, [idea.id]: e.target.value }))}
                      placeholder={selectedVcId ? "Enter feedback to highlight this pitch..." : "Select VC Firm at the top to write feedback..."}
                      disabled={!selectedVcId}
                      className="w-full min-h-[90px] bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 p-3 text-[14px] font-semibold focus:outline-none focus:border-slate-400 resize-none rounded-sm disabled:opacity-60"
                    />

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
                      disabled={reviewState.loading || !selectedVcId}
                      className="w-full inline-flex items-center justify-center px-4 h-10 rounded-sm border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50"
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
