import { Loading } from "@/components/ui/loading";

const InicioLoading = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-96 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-4">
            <div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioLoading;
