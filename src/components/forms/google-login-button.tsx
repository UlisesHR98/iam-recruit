"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

interface GoogleLoginButtonProps {
  disabled?: boolean;
}

export function GoogleLoginButton({ disabled }: GoogleLoginButtonProps) {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsNewAccount = useAuthStore((state) => state.setIsNewAccount);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Asegurar que solo se ejecute en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoadingGoogle(true);
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({
            message: "Error al iniciar sesión con Google",
          }));
          throw new Error(
            error.message || "Error al iniciar sesión con Google"
          );
        }

        const result = await response.json();

        if (result.accessToken) {
          setAccessToken(result.accessToken);
          setIsNewAccount(result.isNewAccount || false);

          toast.success("Sesión iniciada exitosamente", {
            description: result.isNewAccount
              ? "Bienvenido a IAM Recruit"
              : "Bienvenido de nuevo",
          });

          // No desactivar el loading aquí, mantenerlo hasta que cambie la página
          router.replace("/inicio");
          // El loading se mantendrá activo hasta que la navegación se complete
          return;
        } else {
          throw new Error("No se recibió el token de acceso");
        }
      } catch (err) {
        setIsLoadingGoogle(false);
        toast.error(
          err instanceof Error
            ? err.message
            : "Error al iniciar sesión con Google"
        );
      }
    },
    onError: () => {
      toast.error("Error al autenticar con Google");
    },
  });

  if (!isMounted) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full rounded-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200"
      >
        <div className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Google</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => handleGoogleLogin()}
      disabled={isLoadingGoogle || disabled}
      className="w-full rounded-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-slate-400 dark:hover:border-gray-500"
    >
      {isLoadingGoogle ? (
        <>
          <span className="material-symbols-outlined text-[20px] mr-2 text-slate-600 dark:text-gray-300 animate-spin">
            sync
          </span>
          <span className="text-sm font-medium">Iniciando sesión...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium">Google</span>
        </>
      )}
    </Button>
  );
}
