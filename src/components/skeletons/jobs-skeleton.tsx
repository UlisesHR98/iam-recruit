import { Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JobsTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative w-full sm:max-w-sm">
          <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 pl-10" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <div className="h-9 flex-1 sm:flex-none sm:w-32 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="h-9 flex-1 sm:flex-none sm:w-32 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-9 w-9 sm:w-auto sm:min-w-[80px] shrink-0 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <Table className="min-w-[500px] sm:min-w-0">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 sm:px-4 min-w-[200px] sm:w-[300px]">
                  <div className="h-4 w-16 sm:w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </TableHead>
                <TableHead className="px-2 sm:px-4 min-w-[100px]">
                  <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </TableHead>
                <TableHead className="px-2 sm:px-4 min-w-[100px]">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </TableHead>
                <TableHead className="text-right px-2 sm:px-4 min-w-[80px]">
                  <div className="ml-auto h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-32 sm:w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-20 hidden sm:block animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <div className="h-6 w-16 sm:w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <div className="h-6 w-16 sm:w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  </TableCell>
                  <TableCell className="text-right px-2 py-3 sm:px-4 sm:py-4">
                    <div className="ml-auto h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
