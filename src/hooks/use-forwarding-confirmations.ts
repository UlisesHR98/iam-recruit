import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";
import type { ForwardingConfirmation } from "@/lib/types";

export function useForwardingConfirmations() {
  const { data, error, isLoading, mutate } = useSWR<ForwardingConfirmation[]>(
    "/email-ingest/forwarding-confirmations",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const pendingConfirmations =
    data?.filter((confirmation) => !confirmation.confirmed_at) || [];

  return {
    confirmations: data || [],
    pendingConfirmations,
    isLoading,
    isError: error,
    mutate,
  };
}

