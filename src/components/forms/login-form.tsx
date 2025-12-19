"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { loginSchema } from "@/schemas/login.schema";
import type { LoginSchema } from "@/lib/types";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

// Importar dinámicamente solo en el cliente para evitar problemas de SSR
const GoogleLoginButton = dynamic(
  () =>
    import("./google-login-button").then((mod) => ({
      default: mod.GoogleLoginButton,
    })),
  { ssr: false, loading: () => <div className="h-10 w-full" /> }
);

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsNewAccount = useAuthStore((state) => state.setIsNewAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Error al iniciar sesión, verifica tu correo y contraseña",
        }));
        throw new Error(
          error.message ||
            "Error al iniciar sesión, verifica tu correo y contraseña"
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

        const redirectTo = searchParams.get("redirect") || "/inicio";
        // No desactivar el loading aquí, mantenerlo hasta que cambie la página
        router.replace(redirectTo);
        // El loading se mantendrá activo hasta que la navegación se complete
        return;
      } else {
        throw new Error("No se recibió el token de acceso");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md"
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="nombre@compañia.com"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Iniciando sesión
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-slate-200 dark:border-border-dark" />
          <span className="mx-4 text-xs font-semibold text-slate-400 dark:text-text-muted-dark uppercase tracking-wider">
            O continua con
          </span>
          <div className="grow border-t border-slate-200 dark:border-border-dark" />
        </div>

        <GoogleLoginButton disabled={isLoading} />

        <div className="mt-4 text-center text-sm text-slate-500 dark:text-text-muted-dark">
          Protegido por seguridad de nivel empresarial.
          <br />
          Al iniciar sesión, aceptas nuestra{" "}
          <a
            className="text-slate-700 dark:text-white hover:underline"
            href="#"
          >
            Política de Privacidad
          </a>
          .
        </div>
      </FieldGroup>
    </form>
  );
}
