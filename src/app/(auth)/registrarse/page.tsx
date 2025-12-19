import RegisterForm from "@/components/forms/register-form";
import RegisterSkeleton from "@/components/skeletons/register-skeleton";
import RegisterInformation from "@/components/auth/register-information";
import Link from "next/link";
import { Suspense } from "react";

const RegistrarsePage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-dvw overflow-hidden min-h-dvh">
      <div className="flex flex-col items-center justify-center p-4 md:p-8 gap-6 md:gap-8 bg-background min-h-dvh md:min-h-0">
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Crea tu cuenta
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-md px-4">
            Únete a miles de reclutadores que ya usan nuestro filtro inteligente
          </p>
        </div>
        <Suspense fallback={<RegisterSkeleton />}>
          <RegisterForm />
        </Suspense>
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/iniciar-sesion"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
      <RegisterInformation />
    </div>
  );
};

export default RegistrarsePage;
