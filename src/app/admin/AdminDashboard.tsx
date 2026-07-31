"use client";

import { useState, useEffect } from "react";
import { submitVCComment } from "../ideas/actions";
import { ChevronLeft, Award, Filter, Search, BarChart3, Tag, MessageSquare, ShieldCheck, ExternalLink, Calendar, Building, LogOut } from "lucide-react";
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

  const handleLogOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_portal_unlocked");
    setInputPasscode("");
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
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
        <div className="max-w-md w-full space-y-6 bg-white border border-slate-200/80 p-8 rounded-xl shadow-xl animate-fade-in text-center">
          <div className="space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Investor Access Portal
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
                className="flex h-12 w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-800 px-3 py-2 text-center text-lg focus:outline-none focus:border-emerald-500 shadow-inner font-semibold transition-colors"
                required
              />
              {authError && (
                <p className="text-rose-500 text-sm font-semibold">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer"
              >
                Unlock Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Investor Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Sleek control center to filter startup pitches, post verified VC reviews, and highlight selected ideas.
            </p>
          </div>
          
          {/* Quick Info & Log Out */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="bg-white border border-slate-200/80 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
              <Building className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="block text-xs text-slate-400 leading-none">Logged in as</span>
                <span className="text-sm font-bold text-slate-700 mt-1 block">
                  {vcName || "VC Partner"}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogOut}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 rounded-lg px-4 py-3 text-sm font-bold shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer h-[46px]"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* KPI Cards / Statistics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Metric 1 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                {ideas.length}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Total Pitches Submitted
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                {Object.keys(sectorCounts).length}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Active Classified Sectors
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 shadow-sm">
              <BarChart3 className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                {filteredIdeas.length}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Filtered Pitches Matches
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          
          {/* Sector Filter Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="relative flex-1 md:w-64">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', backgroundRepeat: 'no-repeat' }}
              >
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector} className="bg-white text-slate-700">
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
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Grid of Pitches */}
        <div className="space-y-6">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-100/40 animate-fade-in">
              <p className="text-slate-500 text-lg">No pitches match your current filter settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => {
                const reviewState = reviewStatus[idea.id] || { loading: false };
                return (
                  <div 
                    key={idea.id}
                    className="flex flex-col p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{idea.authorName || "Anonymous Founder"}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link
                        href={`/ideas/${idea.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        Open Feed <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Pitch Content */}
                    <p className="text-slate-600 text-[14px] leading-relaxed mb-4 flex-grow font-normal">
                      {idea.content}
                    </p>

                    {/* Auto-Classified Sector Tag */}
                    <div className="mb-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase bg-slate-50 border border-slate-100 text-slate-600">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        Sector: {idea.sector}
                      </span>
                    </div>

                    {/* VC Review Editor - Professional SaaS Form style */}
                    <div className="pt-4 border-t border-slate-100 space-y-4 mt-auto">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Post Verified VC Feedback
                        </span>
                      </div>

                      {/* VC Firm Name Input */}
                      <div className="space-y-1.5">
                        <input 
                          type="text"
                          value={vcName}
                          onChange={(e) => handleVcNameChange(e.target.value)}
                          placeholder="Your VC Firm Name (e.g. Sequoia Capital)"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-slate-800 rounded-lg text-sm px-3 py-2 focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      {/* Feedback Content */}
                      <div className="space-y-1.5">
                        <textarea
                          value={activeReviews[idea.id] || ""}
                          onChange={(e) => setActiveReviews(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          placeholder="Enter professional feedback to highlight this pitch..."
                          className="w-full min-h-[90px] bg-slate-50 border border-slate-200 focus:border-emerald-500 text-slate-800 rounded-lg text-sm p-3 focus:outline-none resize-none transition-colors"
                          required
                        />
                      </div>

                      {/* Status Alerts */}
                      {reviewState.error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium animate-fade-in">
                          ❌ {reviewState.error}
                        </div>
                      )}
                      {reviewState.success && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-600 font-medium animate-fade-in">
                          ✅ Review submitted and highlighted!
                        </div>
                      )}

                      <button
                        onClick={() => handleReviewSubmit(idea.id)}
                        disabled={reviewState.loading}
                        className="w-full mt-1 inline-flex items-center justify-center px-4 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
