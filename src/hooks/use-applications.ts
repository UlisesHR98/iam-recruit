import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type {
  Application,
  ApplicationStatus,
  UseApplicationsOptions,
} from "@/lib/types";

export function useApplications(options?: UseApplicationsOptions) {
  const params = new URLSearchParams();

  if (options?.job_id) {
    params.set("job_id", options.job_id);
  }
  if (options?.status) {
    params.set("status", options.status);
  }
  if (options?.skip !== undefined) {
    params.set("skip", options.skip.toString());
  }
  if (options?.limit !== undefined) {
    params.set("limit", options.limit.toString());
  }
  if (options?.order_by) {
    params.set("order_by", options.order_by);
  }
  if (options?.order_direction) {
    params.set("order_direction", options.order_direction);
  }

  const queryString = params.toString();
  const url = queryString ? `/applications?${queryString}` : "/applications";

  const { data, error, isLoading, mutate } = useSWR<Application[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  return {
    applications: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
