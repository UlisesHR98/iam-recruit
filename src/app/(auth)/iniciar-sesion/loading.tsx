import LoginSkeleton from "@/components/skeletons/login-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 max-w-dvw overflow-hidden h-dvh">
      <div className="relative flex flex-col justify-between p-8 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="wave-gradient-loading"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,200 Q250,150 500,200 T1000,200"
              fill="none"
              stroke="url(#wave-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M0,300 Q250,250 500,300 T1000,300"
              fill="none"
              stroke="url(#wave-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M0,400 Q250,350 500,400 T1000,400"
              fill="none"
              stroke="url(#wave-gradient-loading)"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="size-8 rounded-lg bg-slate-700 animate-pulse" />
            <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/50 mb-8">
            <div className="size-2 rounded-full bg-slate-600 animate-pulse" />
            <div className="h-4 w-20 bg-slate-600 rounded animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="h-16 w-full max-w-lg bg-slate-700/50 rounded-lg mb-6 animate-pulse" />
          <div className="h-6 w-full max-w-md bg-slate-700/50 rounded-lg mb-8 animate-pulse" />
          <div className="h-6 w-full max-w-sm bg-slate-700/50 rounded-lg mb-8 animate-pulse" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="size-5 bg-slate-700/50 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="h-5 w-48 bg-slate-700/50 rounded animate-pulse" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="flex flex-col items-center justify-center p-4 gap-8 bg-background">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-80 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
        <LoginSkeleton />
      </div>
    </div>
  );
}
