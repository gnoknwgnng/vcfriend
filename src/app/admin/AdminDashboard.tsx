"use client";

import { useState, useEffect } from "react";
import { submitVCComment } from "../ideas/actions";
import { ChevronLeft, Award, Filter, Search, BarChart3, Tag, MessageSquare, ShieldCheck } from "lucide-react";
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

// Client-side rule-based sector classifier
function getPitchSector(content: string): string {
  const text = content.toLowerCase();
  
  if (text.includes("coffee") || text.includes("tea") || text.includes("beverage") || text.includes("food") || text.includes("cafe") || text.includes("snack") || text.includes("drink")) {
    return "Food & Beverage";
  }
  if (text.includes("tax") || text.includes("gst") || text.includes("finance") || text.includes("bank") || text.includes("payment") || text.includes("corporate tax") || text.includes("wealth") || text.includes("crypto")) {
    return "Fintech";
  }
  if (text.includes("farm") || text.includes("crop") || text.includes("agriculture") || text.includes("soil") || text.includes("agri") || text.includes("rural")) {
    return "Agri-tech";
  }
  if (text.includes("school") || text.includes("college") || text.includes("education") || text.includes("student") || text.includes("learn") || text.includes("course") || text.includes("tutor")) {
    return "Ed-tech";
  }
  if (text.includes("health") || text.includes("medical") || text.includes("doctor") || text.includes("wellness") || text.includes("fit") || text.includes("clinic") || text.includes("disease")) {
    return "Health & Wellness";
  }
  if (text.includes("ai") || text.includes("machine learning") || text.includes("deeptech") || text.includes("robot") || text.includes("llm") || text.includes("artificial")) {
    return "AI & DeepTech";
  }
  if (text.includes("shop") || text.includes("commerce") || text.includes("store") || text.includes("buy") || text.includes("marketplace") || text.includes("d2c") || text.includes("sell")) {
    return "E-Commerce";
  }
  if (text.includes("saas") || text.includes("b2b") || text.includes("software") || text.includes("api") || text.includes("automation") || text.includes("cloud")) {
    return "SaaS & Enterprise";
  }
  
  return "General / Services";
}

export function AdminDashboard({ ideas }: AdminDashboardProps) {
  const [vcName, setVcName] = useState<string>("");
  const [activeReviews, setActiveReviews] = useState<{ [ideaId: string]: string }>({});
  const [reviewStatus, setReviewStatus] = useState<{ [ideaId: string]: { loading: boolean; error?: string; success?: boolean } }>({});
  
  // Filtering & search state
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      alert("Please enter your VC Firm Name.");
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

  // Classify all ideas and extract unique sectors with their counts
  const classifiedIdeas = ideas.map(idea => ({
    ...idea,
    sector: getPitchSector(idea.content)
  }));

  const sectorCounts: { [key: string]: number } = {};
  classifiedIdeas.forEach(idea => {
    sectorCounts[idea.sector] = (sectorCounts[idea.sector] || 0) + 1;
  });

  const uniqueSectors = ["All Sectors", ...Object.keys(sectorCounts).sort()];

  // Filter ideas based on selected sector and search query
  const filteredIdeas = classifiedIdeas.filter(idea => {
    const matchesSector = selectedSector === "All Sectors" || idea.sector === selectedSector;
    const matchesSearch = searchQuery.trim() === "" || 
      idea.authorName.toLowerCase().includes(searchQuery.trim().toLowerCase()) || 
      idea.content.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesSector && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-book-texture">
        <div className="max-w-md w-full space-y-6 bg-[#faf8f2] border-2 border-amber-800/10 p-8 rounded-sm shadow-2xl animate-fade-in text-center relative">
          {/* Lined paper decoration */}
          <div className="absolute top-0 bottom-0 left-8 w-[1px] bg-red-400/30 pointer-events-none" />
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 20px, #000 20px, #000 21px)",
              backgroundPosition: "0 10px"
            }}
          />

          <div className="relative z-10 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Investor Portal Locked
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Please enter the passcode to access the reviews & highlights board.
              </p>
            </div>
            <form onSubmit={handleUnlock} className="mt-8 space-y-4">
              <input
                type="password"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                placeholder="Enter password..."
                className="flex h-12 w-full rounded-sm border-2 border-slate-200 bg-white text-slate-800 px-3 py-2 text-center text-lg focus:outline-none focus:border-emerald-500 shadow-inner font-bold"
                required
              />
              {authError && (
                <p className="text-rose-500 text-sm font-semibold">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 h-12 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Unlock Portal
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link 
                href="/" 
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      
      {/* Page Header */}
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
            Investor Control Dashboard
          </h1>
        </div>
        <div>
          <p className="chalk-text text-[15px] text-emerald-100/70 block">
            Filter startup pitches, post verified VC reviews, and highlight selected ideas to founders.
          </p>
        </div>
      </div>

      {/* KPI Cards / Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Metric 1 */}
        <div className="bg-[#0f2e1b]/40 border border-emerald-500/20 rounded-md p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-emerald-300 chalk-heading leading-none">
              {ideas.length}
            </span>
            <span className="text-[13px] font-semibold text-emerald-200/50 uppercase tracking-widest mt-1 block">
              Total Pitches Submitted
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0f2e1b]/40 border border-emerald-500/20 rounded-md p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-amber-300 chalk-heading leading-none">
              {Object.keys(sectorCounts).length}
            </span>
            <span className="text-[13px] font-semibold text-emerald-200/50 uppercase tracking-widest mt-1 block">
              Active Classified Sectors
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0f2e1b]/40 border border-emerald-500/20 rounded-md p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-sky-300 chalk-heading leading-none">
              {filteredIdeas.length}
            </span>
            <span className="text-[13px] font-semibold text-emerald-200/50 uppercase tracking-widest mt-1 block">
              Filtered Pitches Matches
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-[#0d2617] border border-emerald-500/20 rounded-md p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
        
        {/* Sector Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="relative flex-1 md:w-64">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-emerald-950/50 border-2 border-emerald-500/20 text-emerald-100 rounded-sm px-3.5 py-2.5 text-base font-bold focus:outline-none focus:border-emerald-400 cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23a7f3d0\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', backgroundRepeat: 'no-repeat' }}
            >
              {uniqueSectors.map((sector) => (
                <option key={sector} value={sector} className="bg-emerald-950 text-emerald-100 font-bold">
                  {sector === "All Sectors" ? "All Sectors" : `${sector} (${sectorCounts[sector] || 0})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Query Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by author or keywords..."
              className="w-full bg-emerald-950/50 border-2 border-emerald-500/20 text-emerald-100 placeholder-emerald-400/40 rounded-sm pl-10 pr-3.5 py-2.5 text-base font-bold focus:outline-none focus:border-emerald-400 shadow-inner"
            />
            <Search className="w-5 h-5 text-emerald-400/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Grid of Pitches */}
      <div className="space-y-6">
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-emerald-500/20 rounded-sm bg-emerald-950/10">
            <p className="chalk-text text-2xl">No pitches match your current filter settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredIdeas.map((idea) => {
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

                  {/* Auto-Classified Sector Tag */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase bg-slate-50 text-slate-700 border-slate-300">
                      <Tag className="w-3 h-3 text-slate-500" />
                      Sector: {idea.sector}
                    </span>
                  </div>

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
                      className="w-full mt-2 inline-flex items-center justify-center px-4 h-11 rounded-sm border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
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
