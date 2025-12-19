"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";

// Importar dinámicamente solo en el cliente para evitar problemas de SSR
const GoogleLoginButton = dynamic(
  () =>
    import("./google-login-button").then((mod) => ({
      default: mod.GoogleLoginButton,
    })),
  { ssr: false, loading: () => <div className="h-10 w-full" /> }
);

import { registerSchema } from "@/schemas/register.schema";
import type { RegisterSchema } from "@/lib/types";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterForm() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsNewAccount = useAuthStore((state) => state.setIsNewAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: data.company_name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Error al registrar usuario" }));
        throw new Error(error.message || "Error al registrar usuario");
      }

      const result = await response.json();

      if (result.accessToken) {
        setAccessToken(result.accessToken);
        setIsNewAccount(true);
        toast.success("Cuenta creada exitosamente", {
          description: "Tu cuenta ha sido registrada correctamente",
        });

        router.replace("/inicio");
      } else {
        throw new Error("No se recibió el token de acceso");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al registrar usuario"
      );
    } finally {
      setIsLoading(false);
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
          name="company_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre de la empresa</FieldLabel>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Mi Empresa S.A."
                  aria-invalid={fieldState.invalid}
                  autoComplete="organization"
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
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

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirmar contraseña</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
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
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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
          Al crear una cuenta, aceptas nuestra{" "}
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
