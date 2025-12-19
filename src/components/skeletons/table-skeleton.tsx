import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
};

export function TableSkeleton({
  columns = 4,
  rows = 5,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[500px] sm:min-w-0">
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead
                  key={i}
                  className={`px-2 sm:px-4 ${
                    i === columns - 1 ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`h-4 w-16 sm:w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${
                      i === columns - 1 ? "ml-auto" : ""
                    }`}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <TableCell
                  key={j}
                  className={`px-2 py-3 sm:px-4 sm:py-4 ${
                    j === columns - 1 ? "text-right" : ""
                  }`}
                >
                  {j === 0 ? (
                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-32 sm:w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-20 hidden sm:block animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ) : j === columns - 1 ? (
                    <div className="ml-auto h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  ) : (
                    <div className="h-6 w-16 sm:w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
