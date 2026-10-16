export default function Loading() {
  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-14" aria-busy="true" aria-label="Loading pitches">
        <div className="skeleton h-4 w-24" />
        <div className="mt-6 mb-10 space-y-3">
          <div className="skeleton h-12 w-80 max-w-full" />
          <div className="skeleton h-5 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-9 w-9 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-3 w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-11/12" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block surface p-6 space-y-3">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-36 w-full" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
