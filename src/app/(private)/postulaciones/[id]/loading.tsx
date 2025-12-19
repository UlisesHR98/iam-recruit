import { Separator } from "@/components/ui/separator";

export default function PostulacionDetailLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted mb-6" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-10 rounded-full animate-pulse bg-muted" />
                  <div className="space-y-2">
                    <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              </div>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
              <div className="text-center py-4">
                <div className="h-12 w-16 mx-auto animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-20 mx-auto mt-2 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    </div>
                    {i < 3 && <Separator className="mt-3" />}
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





