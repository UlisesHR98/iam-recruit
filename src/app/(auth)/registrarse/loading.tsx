import RegisterSkeleton from "@/components/skeletons/register-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-dvw overflow-hidden min-h-dvh">
      <div className="flex flex-col items-center justify-center p-4 md:p-8 gap-6 md:gap-8 bg-background min-h-dvh md:min-h-0">
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <div className="h-9 md:h-10 w-56 md:w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-2" />
          <div className="h-5 md:h-6 w-72 md:w-80 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse px-4" />
        </div>
        <RegisterSkeleton />
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>

      <div className="hidden md:flex relative flex-col justify-between p-6 lg:p-8 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden min-h-dvh">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent" />

          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="register-gradient-loading"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop
                  offset="50%"
                  stopColor="currentColor"
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.4"
                />
              </linearGradient>
            </defs>
            <circle
              cx="80%"
              cy="20%"
              r="150"
              fill="none"
              stroke="url(#register-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
            <circle
              cx="75%"
              cy="50%"
              r="200"
              fill="none"
              stroke="url(#register-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
            <circle
              cx="85%"
              cy="80%"
              r="180"
              fill="none"
              stroke="url(#register-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
            <line
              x1="70%"
              y1="10%"
              x2="90%"
              y2="30%"
              stroke="url(#register-gradient-loading)"
              strokeWidth="1.5"
              className="text-primary"
            />
            <line
              x1="65%"
              y1="40%"
              x2="95%"
              y2="60%"
              stroke="url(#register-gradient-loading)"
              strokeWidth="1.5"
              className="text-primary"
            />
            <line
              x1="75%"
              y1="70%"
              x2="85%"
              y2="90%"
              stroke="url(#register-gradient-loading)"
              strokeWidth="1.5"
              className="text-primary"
            />
          </svg>

          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/25 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <div className="size-7 lg:size-8 rounded-lg bg-slate-700 animate-pulse" />
            <div className="h-4 lg:h-5 w-28 lg:w-32 bg-slate-700 rounded animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-slate-700/50 border border-slate-600/50 mb-6 lg:mb-8">
            <div className="size-1.5 lg:size-2 rounded-full bg-slate-600 animate-pulse" />
            <div className="h-3 lg:h-4 w-20 lg:w-24 bg-slate-600 rounded animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="h-12 lg:h-16 xl:h-20 w-full max-w-lg bg-slate-700/50 rounded-lg mb-4 lg:mb-6 animate-pulse" />
          <div className="h-5 lg:h-6 w-full max-w-md bg-slate-700/50 rounded-lg mb-6 lg:mb-8 animate-pulse" />

          <div className="flex flex-col gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="h-5 lg:h-6 w-full max-w-sm bg-slate-700/50 rounded-lg animate-pulse" />
            <div className="h-5 lg:h-6 w-full max-w-xs bg-slate-700/50 rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="size-4 lg:size-5 bg-slate-700/50 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="h-4 lg:h-5 w-40 lg:w-48 bg-slate-700/50 rounded animate-pulse" />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  );
}
