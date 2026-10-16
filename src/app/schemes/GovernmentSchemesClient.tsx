"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ChevronLeft, ChevronRight, Search, ExternalLink, RefreshCw, Landmark } from "lucide-react";

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


  return (
    <div className="shell py-10 md:py-14 animate-fade-in">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Heading */}
      <Reveal className="mt-6 mb-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]">
          Government schemes
        </h1>
        <p className="mt-3 text-base md:text-lg text-ink-soft">
          Search and filter 220+ verified central, state, and private startup grants and credit schemes.
        </p>
      </Reveal>

      {/* Filters */}
      <Reveal delay={0.15} className="surface p-4 md:p-5 mb-8 sticky top-[76px] z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="scheme-search" className="field-label">Search schemes</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="scheme-search"
                type="text"
                placeholder="Search by name, eligibility, agency..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="field pl-10"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label htmlFor="scheme-level" className="field-label">Level</label>
            <select
              id="scheme-level"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="field"
            >
              <option value="All">All Levels</option>
              <option value="Central">Central Schemes</option>
              <option value="State">State Schemes</option>
              <option value="Corporate/Other">Corporate & Private</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="scheme-type" className="field-label">Support type</label>
            <select
              id="scheme-type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="field"
            >
              <option value="All">All Support Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-3 border-t border-line">
          <div className="text-sm text-ink-soft">
            Found <strong className="text-ink font-semibold tabular-nums">{totalItems}</strong> matching schemes
          </div>
          {(search || level !== "All" || stateFilter !== "All" || typeFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-deep hover:text-coral transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset all filters
            </button>
          )}
        </div>
      </Reveal>

      {/* Schemes Grid */}
      {currentSchemes.length === 0 ? (
        <div className="surface text-center py-16 px-6">
          <p className="text-lg font-medium text-ink">No government schemes match your criteria.</p>
          <button onClick={resetFilters} className="btn btn-ghost btn-sm mt-5">
            Clear filters and try again
          </button>
        </div>
      ) : (
        <RevealGroup key={`${currentPage}-${search}-${level}-${typeFilter}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8" stagger={0.05} amount={0.02}>
          {currentSchemes.map((scheme, index) => {
            const levelLabel = scheme.level.includes("Central") ? "Central" : scheme.level.includes("State") ? "State" : "Other";
            return (
              <article key={index} className="surface surface-hover p-6 flex flex-col">
                {/* Level / State / Type badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`tag ${levelLabel === "Central" ? "tag-teal" : levelLabel === "State" ? "tag-lavender" : "tag-neutral"}`}>
                    {levelLabel}
                  </span>
                  {scheme.state && (
                    <span className="tag tag-outline">{scheme.state}</span>
                  )}
                  {scheme.type && (
                    <span className="tag tag-coral">{scheme.type}</span>
                  )}
                </div>

                {/* Scheme Name */}
                <h3 className="font-display text-xl font-semibold text-ink leading-tight mt-4">
                  {scheme.name}
                </h3>

                {/* Agency */}
                {scheme.agency && (
                  <p className="mt-1.5 inline-flex items-start gap-1.5 text-sm text-muted-foreground leading-snug">
                    <Landmark className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{scheme.agency}</span>
                  </p>
                )}

                {/* Funding Amount / Benefit */}
                {scheme.amount && (
                  <div className="mt-5 rounded-xl bg-teal-light/70 px-4 py-3">
                    <p className="text-xs text-teal-deep/80">Funding / benefit</p>
                    <p className="font-display text-lg font-semibold text-teal-deep leading-snug mt-0.5">
                      {scheme.amount}
                    </p>
                  </div>
                )}

                {/* Eligibility / Target Beneficiary */}
                <div className="flex-1 mt-5">
                  <p className="text-xs text-muted-foreground">Who can apply</p>
                  <p className="mt-1 text-[14px] leading-snug text-ink-soft">
                    {scheme.eligibility || scheme.beneficiary}
                  </p>
                </div>

                {/* Apply Button */}
                {scheme.link && (
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-teal w-full mt-6"
                  >
                    Apply now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </RevealGroup>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-3 mt-6 pt-8 border-t border-line" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-ghost btn-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-sm font-medium text-ink-soft px-3 tabular-nums">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-ghost btn-sm disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
