import { useAuthStore } from "@/stores/auth-store";
import { ensureValidToken, refreshAccessToken } from "@/lib/refresh-token";

export async function fetcher(url: string) {
  let accessToken = await ensureValidToken();

  if (!accessToken) {
    throw new Error("UNAUTHORIZED");
  }

  let res = await fetch(`/api${url}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    accessToken = await refreshAccessToken();

    if (!accessToken) {
      useAuthStore.getState().clearAuth();
      throw new Error("UNAUTHORIZED");
    }

    res = await fetch(`/api${url}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 401) {
      useAuthStore.getState().clearAuth();
      throw new Error("UNAUTHORIZED");
    }
  }

  if (!res.ok) {
    throw new Error("API_ERROR");
  }

  return res.json();
}
