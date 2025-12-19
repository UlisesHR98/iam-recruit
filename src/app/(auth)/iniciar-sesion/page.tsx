import LoginForm from "@/components/forms/login-form";
import LoginSkeleton from "@/components/skeletons/login-skeleton";
import LoginInformation from "@/components/auth/login-information";
import Link from "next/link";
import { Suspense } from "react";

const IniciarSesionPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-dvw overflow-hidden min-h-dvh">
      <LoginInformation />
      <div className="flex flex-col items-center justify-center p-4 md:p-8 gap-6 md:gap-8 bg-background min-h-dvh md:min-h-0">
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Bienvenido de nuevo
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-md px-4">
            Inicia sesion para ver a tus candidatos
          </p>
        </div>
        <Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </Suspense>
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registrarse"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IniciarSesionPage;
