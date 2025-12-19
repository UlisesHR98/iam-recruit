import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { EmailForwardingStatus } from "@/lib/types";

export function useEmailForwardingStatus(jobId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<EmailForwardingStatus>(
    jobId ? `/jobs/${jobId}/email-forwarding/confirmation` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  return {
    status: data,
    isLoading,
    isError: error,
    mutate,
  };
}

