import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { Job, UseJobsOptions } from "@/lib/types";

export function useJobs(options?: UseJobsOptions) {
  const params = new URLSearchParams();
  if (options?.limit) {
    params.set("limit", options.limit.toString());
  }
  if (options?.status) {
    params.set("status", options.status);
  }
  if (options?.area_id) {
    params.set("area_id", options.area_id);
  }

  const queryString = params.toString();
  const url = queryString ? `/jobs?${queryString}` : "/jobs";

  const { data, error, isLoading, mutate } = useSWR<Job[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  return {
    jobs: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
