export function CardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
          <div className="flex items-start justify-between gap-4 min-w-0">
            <div className="flex-1 space-y-3 min-w-0">
              <div className="min-w-0 space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm min-w-0">
                <div className="h-4 w-12 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-2 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-6 w-20 rounded bg-muted" />
                <div className="h-6 w-16 rounded bg-muted" />
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
