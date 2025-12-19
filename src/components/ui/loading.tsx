import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingProps = {
  message?: string;
  variant?: "centered" | "inline" | "header";
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const textSizeClasses = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
};

export function Loading({
  message = "Cargando...",
  variant = "centered",
  className,
  size = "md",
}: LoadingProps) {
  if (variant === "centered") {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center",
          className
        )}
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className={cn("animate-spin", sizeClasses[size])} />
          <p className={textSizeClasses[size]}>{message}</p>
        </div>
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className={cn("space-y-2 text-left", className)}>
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-8 text-center text-muted-foreground",
        className
      )}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <p className={textSizeClasses[size]}>{message}</p>
    </div>
  );
}





