export default function CandidatosLoading() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted mb-2" />
          <div className="h-5 w-64 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-4 space-y-3 animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 rounded bg-muted" />
                <div className="h-6 w-16 rounded bg-muted" />
              </div>
              <div className="h-4 w-24 ml-auto rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
