import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { Application } from "@/lib/types";

export function useApplication(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Application>(
    id ? `/applications/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  return {
    application: data ?? null,
    isLoading,
    isError: error,
    mutate,
  };
}
