export default function Loading() {
  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-14 flex flex-col gap-8" aria-busy="true" aria-label="Loading firms">
        <div className="space-y-3">
          <div className="skeleton h-12 w-3/4 max-w-xl" />
          <div className="skeleton h-5 w-56" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="surface p-6 space-y-4">
              <div className="flex justify-between gap-3">
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-6 w-14 rounded-full" />
              </div>
              <div className="skeleton h-4 w-1/2" />
              <div className="space-y-2 pt-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-11/12" />
                <div className="skeleton h-4 w-3/4" />
              </div>
              <div className="flex gap-2 pt-4">
                <div className="skeleton h-10 flex-1 rounded-full" />
                <div className="skeleton h-10 flex-1 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
