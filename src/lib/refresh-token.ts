import { useAuthStore } from "@/stores/auth-store";

let authCheckInProgress: Promise<string | null> | null = null;

async function verifyTokenAndGetUserInfo(token: string): Promise<{
  isValid: boolean;
  isNewAccount?: boolean;
}> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return { isValid: false };
    }

    const data = await response.json();
    return {
      isValid: true,
      isNewAccount: data.is_new_account,
    };
  } catch {
    return { isValid: false };
  }
}

async function refreshToken(): Promise<{
  token: string | null;
  is401: boolean;
}> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return { token: null, is401: response.status === 401 };
    }

    const data = await response.json();
    return { token: data.accessToken || null, is401: false };
  } catch {
    return { token: null, is401: false };
  }
}

export async function ensureValidToken(): Promise<string | null> {
  if (authCheckInProgress) {
    return authCheckInProgress;
  }

  const existingPromise = useAuthStore.getState().authCheckPromise;
  if (existingPromise) {
    return existingPromise;
  }

  const authCheckPromise = (async () => {
    const store = useAuthStore.getState();
    const currentToken = store.accessToken;

    if (currentToken) {
      const { isValid, isNewAccount } = await verifyTokenAndGetUserInfo(
        currentToken
      );
      if (isValid) {
        if (isNewAccount !== undefined) {
          useAuthStore.getState().setIsNewAccount(isNewAccount);
        }
        return currentToken;
      }
    }

    const { token: newToken, is401 } = await refreshToken();
    if (newToken) {
      useAuthStore.getState().setAccessToken(newToken);

      const { isNewAccount } = await verifyTokenAndGetUserInfo(newToken);
      if (isNewAccount !== undefined) {
        useAuthStore.getState().setIsNewAccount(isNewAccount);
      }

      return newToken;
    }

    useAuthStore.getState().clearAuth();
    if (is401) {
      throw new Error("SESSION_EXPIRED");
    }
    return null;
  })();

  authCheckInProgress = authCheckPromise;
  useAuthStore.getState().setAuthCheckPromise(authCheckPromise);

  try {
    return await authCheckPromise;
  } finally {
    authCheckInProgress = null;
    useAuthStore.getState().setAuthCheckPromise(null);
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const { token: newToken } = await refreshToken();
  if (newToken) {
    useAuthStore.getState().setAccessToken(newToken);
  }
  return newToken;
}
