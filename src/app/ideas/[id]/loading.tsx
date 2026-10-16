export default function Loading() {
  return (
    <div className="flex-1 bg-mist">
      <div className="shell py-10 md:py-14 max-w-3xl" aria-busy="true" aria-label="Loading pitch">
        <div className="skeleton h-4 w-32" />
        <div className="mt-6 surface p-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-5 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </div>
        <div className="mt-12 skeleton h-7 w-56" />
        <div className="mt-6 space-y-4">
          <div className="surface p-6 skeleton h-28" />
          <div className="surface p-6 skeleton h-28" />
        </div>
      </div>
    </div>
  );
}
