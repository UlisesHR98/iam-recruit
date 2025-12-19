import { Separator } from "@/components/ui/separator";

export function PostulationDetailsSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted mb-6" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="h-6 w-36 animate-pulse rounded-md bg-muted" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-4 w-full animate-pulse rounded-md bg-muted"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="space-y-2.5">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-4 w-full animate-pulse rounded-md bg-muted"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-muted/50 sm:col-span-2">
                  <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-20 animate-pulse rounded-full bg-muted"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
              <div className="text-center py-4">
                <div className="h-12 w-16 mx-auto animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-20 mx-auto mt-2 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="pt-4 border-t">
                <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-28 mt-2 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    </div>
                    {i < 4 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
