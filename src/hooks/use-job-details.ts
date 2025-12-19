import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { JobDetails } from "@/lib/types";

export function useJobDetails(jobId?: string) {
  const shouldFetch = Boolean(jobId);

  const { data, error, isLoading } = useSWR<JobDetails>(
    shouldFetch ? `/jobs/${jobId}` : null,
    fetcher
  );

  return {
    details: data ?? null,
    isLoading,
    error,
  };
}

