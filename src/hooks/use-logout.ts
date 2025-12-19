import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      clearAuth();
      router.push("/iniciar-sesion");
      router.refresh();
    }
  };

  return { logout };
}
