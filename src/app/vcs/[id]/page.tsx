import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every minute

export default async function VCDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams.review === 'success';

  // Fetch the VC by ID
  const { data: vc, error } = await supabase
    .from("VC")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vc) {
    notFound();
  }

  // Fetch the reviews for this VC
  const { data: reviews } = await supabase
    .from("VCReview")
    .select("*")
    .eq("vcId", id)
    .order("createdAt", { ascending: false });

  // Custom colors for sticky notes
  const cAbout = { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.5deg]" };
  const cContact = { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[1deg]" };
  const cTeam = { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "-rotate-[0.8deg]" };
  const cReviews = { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", tag: "text-slate-500", divider: "border-slate-200", rotate: "rotate-[0.5deg]" };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-5xl">
      {isSuccess && (
        <div className="w-full bg-emerald-600 text-white text-center py-3 px-4 mb-8 rounded-lg font-medium animate-fade-in shadow-md">
          Thank you! Your review for {vc.name} has been published successfully.
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16">
        <div className="flex-1">
          <h1 className="chalk-heading text-4xl md:text-6xl font-bold tracking-tight mb-3">{vc.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-emerald-200/80 mb-6 chalk-text text-lg">
            <span className="flex items-center gap-1 font-semibold">
              📍 {vc.city ? `${vc.city}, ${vc.country}` : (vc.country || "Global")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold text-amber-300">
              ⭐ {vc.rating ? vc.rating.toFixed(1) : "No ratings yet"}
            </span>
          </div>
          <div className="flex gap-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            <Link 
              href={vc.website ? (vc.website.startsWith('http') ? vc.website : `https://${vc.website}`) : '#'} 
              target="_blank"
              className="flex items-center justify-center rounded-sm px-6 h-12 text-lg font-bold bg-[#faf8f2] text-slate-800 border-2 border-[#e3dccb] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] hover:bg-[#f6f3e6] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Visit Website
            </Link>
            <Link 
              href={`/vcs/${id}/review`}
              className="flex items-center justify-center rounded-sm px-6 h-12 text-lg font-bold border-2 border-dashed border-emerald-400/60 text-[#7ae0a0] hover:bg-emerald-500/10 transition-all hover:scale-105 active:scale-95"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: About & Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Sticky Note */}
          <div 
            className={`
              relative flex flex-col p-6 rounded-sm border-2
              shadow-[5px_5px_18px_rgba(0,0,0,0.25)]
              ${cAbout.card} ${cAbout.rotate}
            `}
            style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
          >
            <div className={`absolute -top-3 left-12 w-5 h-5 rounded-full ${cAbout.pin} shadow-md border-2 border-white/80 z-10`} />
            <div className="absolute -top-3 left-12 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                backgroundPositionY: "44px",
              }}
            />

            <h2 className={`text-2xl font-bold mb-3 mt-2 ${cAbout.title}`}>About {vc.name}</h2>
            <div className={`border-b-2 border-dashed ${cAbout.divider} mb-4`} />
            
            <div className="space-y-6">
              <div>
                <h3 className={`font-bold text-lg mb-1 ${cAbout.title}`}>Investment Thesis & Description</h3>
                <p className={`text-base leading-relaxed ${cAbout.text}`}>{vc.description || vc.investmentThesis || "No detailed description provided."}</p>
              </div>

              <div className={`border-b-2 border-dashed ${cAbout.divider}`} />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${cAbout.tag}`}>Check Size</h3>
                  <p className={`text-xl font-bold mt-1 ${cAbout.title}`}>
                    {vc.minCheck || vc.maxCheck 
                      ? `${vc.minCheck ? `$${Number(vc.minCheck).toLocaleString()}` : '...'} - ${vc.maxCheck ? `$${Number(vc.maxCheck).toLocaleString()}` : '...'}`
                      : "Not disclosed"}
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${cAbout.tag}`}>Verified Status</h3>
                  <div className="mt-1">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-sm border ${vc.isApproved ? "bg-emerald-200 text-emerald-800 border-emerald-400" : "bg-slate-200 text-slate-800 border-slate-400"}`}>
                      {vc.isApproved ? "Verified Profile" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Reviews Sticky Note */}
          <div 
            className={`
              relative flex flex-col p-6 rounded-sm border-2
              shadow-[5px_5px_18px_rgba(0,0,0,0.25)]
              ${cReviews.card} ${cReviews.rotate}
            `}
            style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
          >
            <div className={`absolute -top-3 left-12 w-5 h-5 rounded-full ${cReviews.pin} shadow-md border-2 border-white/80 z-10`} />
            <div className="absolute -top-3 left-12 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                backgroundPositionY: "44px",
              }}
            />

            <div className="flex items-center justify-between mt-2 mb-3">
              <div>
                <h2 className={`text-2xl font-bold ${cReviews.title}`}>Founder Reviews</h2>
                <p className={`text-[13px] font-semibold mt-1 uppercase ${cReviews.tag}`}>Read authentic experiences from founders.</p>
              </div>
              {reviews && reviews.length > 0 && (
                <Link 
                  href={`/vcs/${id}/review`} 
                  className={`text-sm font-bold border-2 border-[#b8e2fc] bg-[#e1f5fe] hover:bg-[#b3e5fc] px-3 py-1 rounded-sm ${cReviews.tag}`}
                >
                  Write Review
                </Link>
              )}
            </div>
            <div className={`border-b-2 border-dashed ${cReviews.divider} mb-4`} />

            <div>
              {!reviews || reviews.length === 0 ? (
                <div className={`text-center py-8 border-2 border-dashed ${cReviews.divider} rounded-sm bg-white/30 mt-4 flex flex-col items-center justify-center`}>
                  <p className={`mb-3 font-semibold ${cReviews.text}`}>No reviews have been submitted yet.</p>
                  <Link 
                    href={`/vcs/${id}/review`}
                    className={`inline-block text-sm font-bold border-2 border-[#b8e2fc] bg-[#e1f5fe] hover:bg-[#b3e5fc] px-4 py-1.5 rounded-sm ${cReviews.tag}`}
                  >
                    Be the first to review
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-sm bg-white/40 border border-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`font-bold text-sm ${cReviews.title}`}>{review.authorName}</div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current text-amber-400' : 'text-slate-300 stroke-current fill-none'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${cReviews.text}`}>{review.content}</p>
                      <div className={`text-[11px] font-semibold mt-2 uppercase ${cReviews.tag}`}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Contact, Team) */}
        <div className="space-y-10">
          
          {/* Contact Sticky Note */}
          <div 
            className={`
              relative flex flex-col p-6 rounded-sm border-2
              shadow-[5px_5px_18px_rgba(0,0,0,0.25)]
              ${cContact.card} ${cContact.rotate}
            `}
            style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
          >
            <div className={`absolute -top-3 left-12 w-5 h-5 rounded-full ${cContact.pin} shadow-md border-2 border-white/80 z-10`} />
            <div className="absolute -top-3 left-12 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                backgroundPositionY: "44px",
              }}
            />

            <h2 className={`text-2xl font-bold mb-3 mt-2 ${cContact.title}`}>Contact</h2>
            <div className={`border-b-2 border-dashed ${cContact.divider} mb-4`} />

            <div className="space-y-4">
              {vc.email ? (
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${cContact.tag}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href={`mailto:${vc.email}`} className={`text-base font-bold hover:underline ${cContact.title}`}>{vc.email}</a>
                </div>
              ) : null}

              {vc.linkedin ? (
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${cContact.tag}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <a href={vc.linkedin.startsWith('http') ? vc.linkedin : `https://${vc.linkedin}`} target="_blank" className={`text-base font-bold hover:underline ${cContact.title}`}>LinkedIn Profile</a>
                </div>
              ) : null}

              {vc.twitter ? (
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${cContact.tag}`} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  <a href={vc.twitter.startsWith('http') ? vc.twitter : `https://${vc.twitter}`} target="_blank" className={`text-base font-bold hover:underline ${cContact.title}`}>Twitter (X)</a>
                </div>
              ) : null}

              {!vc.email && !vc.linkedin && !vc.twitter && (
                <div className={`text-sm font-semibold italic ${cContact.tag}`}>No contact information available.</div>
              )}
            </div>
          </div>

          {/* Team Sticky Note */}
          <div 
            className={`
              relative flex flex-col p-6 rounded-sm border-2
              shadow-[5px_5px_18px_rgba(0,0,0,0.25)]
              ${cTeam.card} ${cTeam.rotate}
            `}
            style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
          >
            <div className={`absolute -top-3 left-12 w-5 h-5 rounded-full ${cTeam.pin} shadow-md border-2 border-white/80 z-10`} />
            <div className="absolute -top-3 left-12 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                backgroundPositionY: "44px",
              }}
            />

            <h2 className={`text-2xl font-bold mb-3 mt-2 ${cTeam.title}`}>Team</h2>
            <div className={`border-b-2 border-dashed ${cTeam.divider} mb-4`} />
            
            <div className={`text-sm font-semibold italic ${cTeam.tag}`}>
              No team members listed yet.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

