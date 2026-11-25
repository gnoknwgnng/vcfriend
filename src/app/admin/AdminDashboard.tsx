"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { adminLogout, submitVCComment } from "./actions";
import { Award, Filter, Search, BarChart3, Tag, MessageSquare, Calendar, Building, LogOut } from "lucide-react";

interface Idea {
  id: string;
  authorName: string | null;
  content: string;
  createdAt: string;
  contactInfo?: string | null;
}

interface AdminDashboardProps {
  ideas: Idea[];
}

// Client-side rule-based sector classifier.
// Rules match whole words (or word prefixes via \w*), so "team" is not read
// as "tea" and "profit" is not read as "fit". The first matching rule wins.
const SECTOR_RULES: [sector: string, pattern: RegExp][] = [
  ["Food & Beverage", /\b(coffee|tea|beverages?|foods?|cafes?|snacks?|drinks?)\b/],
  ["Fintech", /\b(tax(es)?|gst|financ\w*|bank\w*|payments?|wealth|crypto\w*)\b/],
  ["Agri-tech", /\b(farm\w*|crops?|agricultur\w*|soil|agri\w*|rural)\b/],
  ["Ed-tech", /\b(schools?|colleges?|educat\w*|students?|learn\w*|courses?|tutor\w*)\b/],
  ["Health & Wellness", /\b(health\w*|medical|doctors?|wellness|fit|fitness|clinics?|diseases?)\b/],
  ["AI & DeepTech", /\b(ai|machine learning|deeptech|robot\w*|llms?|artificial)\b/],
  ["E-Commerce", /\b(shop\w*|e-?commerce|commerce|stores?|buy\w*|marketplaces?|d2c|sell\w*)\b/],
  ["SaaS & Enterprise", /\b(saas|b2b|software|apis?|automat\w*|cloud)\b/],
];

function getPitchSector(content: string): string {
  const text = content.toLowerCase();
  for (const [sector, pattern] of SECTOR_RULES) {
    if (pattern.test(text)) return sector;
  }
  return "General / Services";
}

// The dashboard is rendered on the server and then hydrated in the browser,
// so dates use one fixed locale and time zone: the two renders must match.
const pitchDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

function formatPitchDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : pitchDateFormat.format(date);
}

// The VC firm name is remembered in localStorage between visits.
const VC_NAME_KEY = "vc_admin_name";
const vcNameListeners = new Set<() => void>();

function subscribeVcName(callback: () => void) {
  vcNameListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    vcNameListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readVcName(): string {
  try {
    return localStorage.getItem(VC_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeVcName(name: string) {
  try {
    localStorage.setItem(VC_NAME_KEY, name);
  } catch {
    // Storage unavailable (private mode): the name simply is not remembered.
  }
  vcNameListeners.forEach((listener) => listener());
}

export function AdminDashboard({ ideas }: AdminDashboardProps) {
  const router = useRouter();
  const vcName = useSyncExternalStore(subscribeVcName, readVcName, () => "");
  const [activeReviews, setActiveReviews] = useState<{ [ideaId: string]: string }>({});
  const [reviewStatus, setReviewStatus] = useState<{ [ideaId: string]: { loading: boolean; error?: string; success?: boolean } }>({});

  // Filtering & search state
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleVcNameChange = (name: string) => {
    writeVcName(name);
  };

  const handleLogOut = async () => {
    await adminLogout();
    router.refresh();
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

    let res: Awaited<ReturnType<typeof submitVCComment>>;
    try {
      res = await submitVCComment(ideaId, vcName, content);
    } catch {
      res = { error: "Could not reach the server. Please try again." };
    }

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
      (idea.authorName || "").toLowerCase().includes(searchQuery.trim().toLowerCase()) || 
      idea.content.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-mist text-ink font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="border-b border-line pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">
              Investor Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Sleek control center to filter startup pitches, post verified VC reviews, and highlight selected ideas.
            </p>
          </div>
          
          {/* Quick Info & Log Out */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="surface px-3 py-2 flex items-center gap-2.5">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-teal shrink-0" />
              <div className="min-w-0">
                <span className="block text-[9px] sm:text-xs text-muted-foreground leading-none">Logged in as</span>
                <span className="text-xs sm:text-sm font-semibold text-ink mt-1 block truncate max-w-[120px] sm:max-w-none">
                  {vcName || "VC Partner"}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogOut}
              className="bg-coral-light hover:bg-[#f9d9d0] text-coral-deep border border-[#f3c4b8] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer h-[38px] sm:h-[46px] shrink-0"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* KPI Cards / Statistics Panel */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6">
          {/* Metric 1 */}
          <div className="surface p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:gap-5 text-center sm:text-left">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-teal-light flex items-center justify-center shrink-0 mb-1.5 sm:mb-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-teal-deep" />
            </div>
            <div>
              <span className="block font-display text-lg sm:text-2xl font-bold text-ink leading-none">
                {ideas.length}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground mt-1 block">
                Pitches
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="surface p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:gap-5 text-center sm:text-left">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-coral-light flex items-center justify-center shrink-0 mb-1.5 sm:mb-0">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-coral-deep" />
            </div>
            <div>
              <span className="block font-display text-lg sm:text-2xl font-bold text-ink leading-none">
                {Object.keys(sectorCounts).length}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground mt-1 block">
                Sectors
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="surface p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:gap-5 text-center sm:text-left">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-lavender-light flex items-center justify-center shrink-0 mb-1.5 sm:mb-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#5e4580]" />
            </div>
            <div>
              <span className="block font-display text-lg sm:text-2xl font-bold text-ink leading-none">
                {filteredIdeas.length}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground mt-1 block">
                Matches
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="surface p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sector Filter Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
            <div className="relative flex-1 md:w-64">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="field h-11 text-sm"
              >
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector} className="bg-white text-ink">
                    {sector === "All Sectors" ? "All Sectors" : `${sector} (${sectorCounts[sector] || 0})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Query Search Input */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 md:max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by author or keywords..."
                className="field h-11 text-sm pl-10"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Grid of Pitches */}
        <div className="space-y-6">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-line rounded-2xl bg-white/60 animate-fade-in">
              <p className="text-ink-soft text-lg">No pitches match your current filter settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => {
                const reviewState = reviewStatus[idea.id] || { loading: false };
                return (
                  <div 
                    key={idea.id}
                    className="surface surface-hover flex flex-col p-6"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                      <div>
                        <span className="font-semibold text-sm text-ink">{idea.authorName || "Anonymous Founder"}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatPitchDate(idea.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pitch Content */}
                    <p className="text-ink-soft text-[14px] leading-relaxed mb-4 flex-grow">
                      {idea.content}
                    </p>

                    {/* Auto-Classified Sector Tag & Contact Info */}
                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="tag tag-lavender">
                        <Tag className="w-3.5 h-3.5 " />
                        Sector: {idea.sector}
                      </span>
                      {idea.contactInfo && (
                        <span className="tag tag-outline select-all" title="Click to copy contact info">
                          Contact: {idea.contactInfo}
                        </span>
                      )}
                    </div>

                    {/* VC Review Editor - Professional SaaS Form style */}
                    <div className="pt-4 border-t border-line space-y-3 mt-auto">
                      <div className="flex items-center gap-1.5 text-ink-soft">
                        <Award className="w-4 h-4 text-teal-deep" />
                        <span className="text-xs font-semibold">
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
                          className="field h-11 text-sm"
                          required
                        />
                      </div>

                      {/* Feedback Content */}
                      <div className="space-y-1.5">
                        <textarea
                          value={activeReviews[idea.id] || ""}
                          onChange={(e) => setActiveReviews(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          placeholder="Enter professional feedback to highlight this pitch..."
                          className="field min-h-[90px] text-sm resize-none"
                          required
                        />
                      </div>

                      {/* Status Alerts */}
                      {reviewState.error && (
                        <div className="notice notice-error animate-fade-in">
                          ❌ {reviewState.error}
                        </div>
                      )}
                      {reviewState.success && (
                        <div className="notice notice-success animate-fade-in">
                          ✅ Review submitted and highlighted!
                        </div>
                      )}

                      <button
                        onClick={() => handleReviewSubmit(idea.id)}
                        disabled={reviewState.loading}
                        className="btn btn-sm btn-teal w-full mt-1"
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
