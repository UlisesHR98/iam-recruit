import useSWR from "swr";
import { fetcher } from "@/lib/fetchers";

export interface UserInfo {
  email: string;
  is_new_account?: boolean;
  [key: string]: unknown;
}

export function useUser() {
  const { data, error, isLoading } = useSWR<UserInfo>("/auth/me", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // Cache por 1 minuto
  });

  return {
    user: data || null,
    isLoading,
    isError: error,
  };
}
