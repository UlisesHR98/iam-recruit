import { FC, ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  delta?: number;
  icon?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, delta, icon }) => {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 sm:px-5 py-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          {title}
        </p>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl font-semibold text-foreground">
            {value}
          </span>

          {delta !== undefined && (
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                isPositive
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {delta}
            </span>
          )}
        </div>
      </div>

      {icon && (
        <div className="ml-2 rounded-md bg-brand-orange/20 p-2 text-brand-orange shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
