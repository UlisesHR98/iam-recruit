import InicioClient from "@/components/inicio/inicio-client";

const InicioPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Esto es lo que ha pasado con tus candidatos hoy
        </p>
      </div>
      <InicioClient />
    </div>
  );
};

export default InicioPage;
