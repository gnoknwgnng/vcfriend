export default function Loading() {
  return (
    <div className="flex-1 bg-mist" aria-busy="true" aria-label="Loading firm">
      <div className="bg-white border-b border-line">
        <div className="shell py-10 md:py-14 max-w-5xl space-y-5">
          <div className="skeleton h-4 w-20" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-6 w-36 rounded-full" />
          </div>
          <div className="skeleton h-14 w-2/3" />
          <div className="skeleton h-5 w-48" />
        </div>
      </div>
      <div className="shell py-10 md:py-14 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface p-8 space-y-3">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-2/3" />
          </div>
          <div className="surface p-8 space-y-3">
            <div className="skeleton h-7 w-40" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="surface p-7 space-y-3">
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-11 w-full" />
            <div className="skeleton h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
