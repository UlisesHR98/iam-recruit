import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ensureValidToken } from "@/lib/refresh-token";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthBootstrap() {
  const initialized = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const runCheck = async () => {
      try {
        const token = await ensureValidToken();
        if (!token) {
          clearAuth();
          if (pathname !== "/iniciar-sesion" && pathname !== "/registrarse") {
            router.push("/iniciar-sesion");
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          toast.error("Sesión expirada", {
            description: "Por favor, inicia sesión nuevamente",
          });
        }
        clearAuth();
        if (pathname !== "/iniciar-sesion" && pathname !== "/registrarse") {
          router.push("/iniciar-sesion");
        }
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      runCheck();
      return;
    }

    runCheck();
  }, [pathname, clearAuth, router]);
}
