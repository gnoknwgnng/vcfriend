import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Dynamic rendering for search parameters

export default async function VCDirectory({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const stage = params?.stage as string;
  const sector = params?.sector as string;
  const pageStr = params?.page as string;
  
  const page = parseInt(pageStr) || 1;
  const limit = 50;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from('VC')
    .select('*', { count: 'exact' })
    .order('createdAt', { ascending: false });

  if (stage) {
    query = query.ilike('description', `%${stage}%`);
  }

  if (sector && sector !== 'All Sectors') {
    query = query.ilike('sector', `%${sector}%`);
  }

  const { data: vcs, error, count } = await query.range(start, end);

  if (error) {
    console.error("Error fetching VCs:", error);
  }

  const displayVCs = vcs || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const PITCH_COLORS = [
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.5deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.6deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.4deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
    { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.8deg]", badge: "bg-slate-100 text-slate-800 border-slate-300" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="chalk-heading text-3xl md:text-5xl font-bold tracking-tight mb-2">Active Venture Capital Firms</h1>
            <p className="chalk-text text-xl">Showing {displayVCs.length} of {totalCount} investors.</p>
          </div>
        </div>

        {/* VC Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayVCs.map((vc, index) => {
            const c = PITCH_COLORS[index % PITCH_COLORS.length];
            return (
              <div 
                key={vc.id}
                className={`
                  relative flex flex-col p-6 rounded-sm border-2 cursor-interactive
                  shadow-[4px_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]
                  ${c.card} ${c.rotate}
                  transition-shadow duration-300
                `}
                style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
              >
                {/* Pin */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />
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

                <div className="mt-3 mb-2 flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-bold leading-tight ${c.title}`}>{vc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[12px] font-bold uppercase tracking-wider ${c.tag}`}>
                        ⭐ Rating: {vc.rating ? vc.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`border-b-2 border-dashed ${c.divider} mb-3`} />
                
                <div className="space-y-3 flex-grow">
                  <div className="space-y-1.5">
                    <p className={`text-[15px] leading-snug line-clamp-3 ${c.text}`}>
                      {vc.description || vc.investmentThesis || "No description provided."}
                    </p>
                  </div>
                  
                  <div className={`pt-2 flex flex-col gap-1 text-[13px] font-bold ${c.tag}`}>
                    <div className="flex items-center gap-1.5">
                      📍 {vc.city ? `${vc.city}, ${vc.country}` : (vc.country || "Global")}
                    </div>
                    {(vc.minCheck || vc.maxCheck) && (
                      <div className="flex items-center gap-1.5">
                        💵 Check: {vc.minCheck ? `$${Number(vc.minCheck).toLocaleString()}` : '...'} - {vc.maxCheck ? `$${Number(vc.maxCheck).toLocaleString()}` : '...'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`border-b-2 border-dashed ${c.divider} my-4`} />
                
                <div className="flex gap-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  <Link 
                    href={`/vcs/${vc.id}`}
                    className={`flex-1 flex items-center justify-center h-10 text-sm font-bold border-2 border-dashed text-slate-700 hover:bg-black/5 rounded-sm ${c.divider}`}
                  >
                    View Profile
                  </Link>
                  <Link 
                    href={`/vcs/${vc.id}/review`}
                    className={`flex-1 flex items-center justify-center h-10 text-sm font-bold rounded-sm border-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all ${c.badge}`}
                  >
                    Write a Review
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12 pt-6 border-t border-emerald-500/20" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            {page > 1 ? (
              <Link 
                href={`/vcs?page=${page - 1}${stage ? `&stage=${stage}` : ''}${sector ? `&sector=${sector}` : ''}`}
                className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10 font-bold text-lg"
              >
                Previous
              </Link>
            ) : (
              <span className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-500/10 text-emerald-500/40 font-bold text-lg cursor-not-allowed">Previous</span>
            )}
            
            <span className="text-xl font-bold chalk-text">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link 
                href={`/vcs?page=${page + 1}${stage ? `&stage=${stage}` : ''}${sector ? `&sector=${sector}` : ''}`}
                className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10 font-bold text-lg"
              >
                Next
              </Link>
            ) : (
              <span className="flex items-center justify-center px-4 py-2 rounded-sm border-2 border-emerald-500/10 text-emerald-500/40 font-bold text-lg cursor-not-allowed">Next</span>
            )}
          </div>
        )}
      </main>

    </div>
  );
}

