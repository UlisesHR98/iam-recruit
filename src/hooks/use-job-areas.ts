import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { JobArea, UseJobAreasOptions } from "@/lib/types";

export function useJobAreas(options?: UseJobAreasOptions) {
  const params = new URLSearchParams();
  if (options?.activeOnly) {
    params.set("is_active", "true");
  }

  const queryString = params.toString();
  const url = queryString ? `/job-areas?${queryString}` : "/job-areas";

  const { data, error, isLoading, mutate } = useSWR<JobArea[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  const areas = data ? [...data].sort((a, b) => a.order - b.order) : [];
  return {
    areas,
    isLoading,
    isError: error,
    mutate,
  };
}
