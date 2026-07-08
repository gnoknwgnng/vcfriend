"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Filter, ExternalLink, RefreshCw } from "lucide-react";

interface Scheme {
  name: string;
  level: string;
  state: string;
  agency: string;
  category: string;
  type: string;
  amount: string;
  eligibility: string;
  beneficiary: string;
  link: string;
}

export function GovernmentSchemesClient({ schemes }: { schemes: Scheme[] }) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Extract unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    schemes.forEach((s) => {
      if (s.state && s.state.trim()) {
        states.add(s.state.trim());
      }
    });
    return Array.from(states).sort();
  }, [schemes]);

  // Extract unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    schemes.forEach((s) => {
      if (s.type) {
        // Normalize type briefly
        let t = s.type.toLowerCase();
        if (t.includes("grant")) types.add("Grant");
        else if (t.includes("loan") || t.includes("credit") || t.includes("debt")) types.add("Loan / Credit");
        else if (t.includes("equity")) types.add("Equity");
        else if (t.includes("credits") || t.includes("cloud")) types.add("Credits");
        else if (t.includes("incubation") || t.includes("accelerator")) types.add("Incubation / Accelerator");
        else types.add("Other Support");
      }
    });
    return Array.from(types).sort();
  }, [schemes]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      // 1. Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        !search ||
        s.name.toLowerCase().includes(searchLower) ||
        s.agency.toLowerCase().includes(searchLower) ||
        s.eligibility.toLowerCase().includes(searchLower) ||
        s.beneficiary.toLowerCase().includes(searchLower) ||
        (s.state && s.state.toLowerCase().includes(searchLower));

      // 2. Level filter
      const matchesLevel = 
        level === "All" ||
        (level === "Central" && s.level.toLowerCase().includes("central")) ||
        (level === "State" && s.level.toLowerCase().includes("state")) ||
        (level === "Corporate/Other" && !s.level.toLowerCase().includes("central") && !s.level.toLowerCase().includes("state"));

      // 3. State filter
      const matchesState = 
        stateFilter === "All" ||
        s.state === stateFilter;

      // 4. Type filter
      let matchesType = true;
      if (typeFilter !== "All") {
        const t = s.type.toLowerCase();
        if (typeFilter === "Grant") matchesType = t.includes("grant");
        else if (typeFilter === "Loan / Credit") matchesType = t.includes("loan") || t.includes("credit") || t.includes("debt");
        else if (typeFilter === "Equity") matchesType = t.includes("equity");
        else if (typeFilter === "Credits") matchesType = t.includes("credits") || t.includes("cloud");
        else if (typeFilter === "Incubation / Accelerator") matchesType = t.includes("incubation") || t.includes("accelerator");
        else matchesType = !t.includes("grant") && !t.includes("loan") && !t.includes("credit") && !t.includes("debt") && !t.includes("equity") && !t.includes("credits") && !t.includes("cloud") && !t.includes("incubation") && !t.includes("accelerator");
      }

      return matchesSearch && matchesLevel && matchesState && matchesType;
    });
  }, [schemes, search, level, stateFilter, typeFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setLevel("All");
    setStateFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  // Pagination
  const totalItems = filteredSchemes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchemes = filteredSchemes.slice(indexOfFirstItem, indexOfLastItem);

  // Card colors/rotations matching pitch feed style
  const SCHEME_COLORS = [
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.5deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.8deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.6deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.4deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      {/* Back button */}
      <div className="mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
        <Link 
          href="/" 
          className="inline-flex items-center text-lg font-bold text-emerald-200 hover:text-emerald-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-10 text-center lg:text-left flex flex-col space-y-2">
        <h1 className="chalk-heading block text-4xl md:text-5xl font-bold tracking-tight">
          Government Schemes
        </h1>
        <p className="chalk-text block text-xl">
          Search and filter 220+ verified central, state, and private startup grants and credit schemes.
        </p>
      </div>

      {/* Filters Bar - Styled like a realistic wooden-framed classroom chalkboard */}
      <div className="relative bg-[#0d2216] border-[6px] md:border-[12px] border-[#5c3a21] rounded-lg p-3.5 md:p-5 mb-8 md:mb-10 shadow-[0_16px_50px_rgba(0,0,0,0.6),_inset_0_4px_12px_rgba(0,0,0,0.9)]">
        {/* Subtle inner chalk dust line */}
        <div className="absolute inset-0.5 md:inset-1 border border-yellow-700/10 pointer-events-none rounded-[2px]" />
        
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5 items-end">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block font-bold text-amber-400 uppercase tracking-wider mb-1 md:mb-1.5" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}>
                Search Schemes
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-700 z-10" />
                <input
                  type="text"
                  placeholder="Search by name, eligibility, agency..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8.5 pr-4 py-2 md:py-2.5 bg-[#faf8f2] border-2 border-emerald-800/10 rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs md:text-sm font-medium shadow-inner"
                />
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block font-bold text-amber-400 uppercase tracking-wider mb-1 md:mb-1.5" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}>
                Level
              </label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 md:py-2.5 bg-[#faf8f2] border-2 border-emerald-800/10 rounded-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs md:text-sm font-semibold shadow-inner cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Central">Central Schemes</option>
                <option value="State">State Schemes</option>
                <option value="Corporate/Other">Corporate & Private</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block font-bold text-amber-400 uppercase tracking-wider mb-1 md:mb-1.5" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}>
                Support Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 md:py-2.5 bg-[#faf8f2] border-2 border-emerald-800/10 rounded-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs md:text-sm font-semibold shadow-inner cursor-pointer"
              >
                <option value="All">All Support Types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-3 border-t border-emerald-500/10">
            <div className="text-xs md:text-sm text-emerald-300/90 font-medium">
              Found <strong className="text-emerald-100 font-bold">{totalItems}</strong> matching schemes
            </div>
            {(search || level !== "All" || stateFilter !== "All" || typeFilter !== "All") && (
              <button
                onClick={resetFilters}
                className="flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest cursor-pointer"
                style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Chalk Ledge / Tray at the bottom of the wooden frame */}
        <div className="absolute -bottom-1 md:-bottom-1.5 left-1/2 -translate-x-1/2 w-[85%] h-2 md:h-3 bg-[#4a2e1a] rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-t border-[#6f472d] z-20 flex items-center justify-start px-4 md:px-8 gap-2 md:gap-4 pointer-events-none">
          {/* Felt Eraser */}
          <div className="w-8 h-1.5 md:w-12 md:h-2.5 bg-[#8b5a2b] border-t border-[#d8c3a5]/20 rounded-t-sm shadow-sm flex flex-col justify-end">
            <div className="w-full h-[60%] bg-[#2a2a2a] rounded-t-sm" />
          </div>
          {/* White Chalk Piece */}
          <div className="w-6 h-1 md:w-8 md:h-1.5 bg-[#f7f5ed] rounded-full rotate-6 shadow-sm opacity-95" />
          {/* Yellow Chalk Piece */}
          <div className="w-5 h-1 md:w-6 md:h-1.5 bg-[#fbbf24] rounded-full -rotate-12 shadow-sm opacity-95" />
          {/* Pink Chalk Piece */}
          <div className="w-5.5 h-1 md:w-7 md:h-1.5 bg-[#ec4899] rounded-full rotate-3 shadow-sm opacity-95" />
        </div>
      </div>

      {/* Schemes Grid */}
      {currentSchemes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-emerald-500/20 rounded-sm">
          <p className="chalk-text text-2xl text-emerald-300/80 mb-2">No government schemes match your criteria.</p>
          <button
            onClick={resetFilters}
            className="text-amber-400 font-bold underline hover:text-amber-300 cursor-pointer"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "18px" }}
          >
            Clear filters and try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {currentSchemes.map((scheme, index) => {
            const c = SCHEME_COLORS[index % SCHEME_COLORS.length];
            return (
              <div
                key={index}
                className={`
                  relative flex flex-col pl-12 pr-6 pt-6 pb-6 rounded-sm border-2 cursor-interactive
                  shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]
                  ${c.card} ${c.rotate}
                  transition-all duration-300 hover:scale-[1.02] hover:z-10
                `}
                style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
              >
                {/* Level / State Badge */}
                <div className="absolute top-3 right-3 flex gap-1 z-20">
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                    {scheme.level.includes("Central") ? "Central" : scheme.level.includes("State") ? "State" : "Other"}
                  </span>
                  {scheme.state && (
                    <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                      {scheme.state}
                    </span>
                  )}
                </div>

                {/* Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-400 shadow-md border-2 border-white/80 z-10" />
                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
                
                {/* Lined paper texture */}
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                    backgroundPositionY: "44px",
                  }}
                />

                {/* Notebook red margin line */}
                <div className="absolute left-9 top-0 bottom-0 w-[1px] bg-rose-400/40 pointer-events-none" />

                {/* Type Badge */}
                {scheme.type && (
                  <div className={`self-start mb-3 mt-2 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${c.badge}`}>
                    {scheme.type}
                  </div>
                )}

                {/* Scheme Name */}
                <h3 className={`text-2xl font-bold leading-tight mb-1 pr-14 ${c.title}`}>
                  {scheme.name}
                </h3>

                {/* Agency */}
                {scheme.agency && (
                  <p className="text-[12px] font-semibold text-slate-500 mb-4 uppercase tracking-wide leading-tight">
                    🏛️ {scheme.agency}
                  </p>
                )}

                {/* Dashed divider */}
                <div className={`border-b-2 border-dashed ${c.divider} mb-4`} />

                {/* Funding Amount / Benefit */}
                {scheme.amount && (
                  <div className="mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                      Funding / Benefit
                    </p>
                    <p className="text-[18px] font-extrabold text-emerald-700 leading-snug">
                      💰 {scheme.amount}
                    </p>
                  </div>
                )}

                {/* Eligibility / Target Beneficiary */}
                <div className="flex-1 mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                    Who can apply
                  </p>
                  <p className={`text-[14px] leading-snug ${c.text}`}>
                    {scheme.eligibility || scheme.beneficiary}
                  </p>
                </div>

                {/* Apply Button */}
                {scheme.link && (
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded-sm text-sm transition-colors shadow-sm cursor-pointer"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "18px" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded bg-[#132c1e]/60 border border-emerald-500/20 text-emerald-200 disabled:opacity-40 hover:bg-[#132c1e] transition-colors disabled:pointer-events-none cursor-pointer"
          >
            ← Previous
          </button>
          
          <span className="text-emerald-200 mx-4 font-bold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 rounded bg-[#132c1e]/60 border border-emerald-500/20 text-emerald-200 disabled:opacity-40 hover:bg-[#132c1e] transition-colors disabled:pointer-events-none cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
