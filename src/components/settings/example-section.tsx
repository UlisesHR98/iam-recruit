"use client";

export function ExampleSection() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Nueva Sección</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Descripción de la nueva sección de configuración
          </p>
        </div>
      </div>

      <div className="rounded-md border p-6">
        <p className="text-muted-foreground">
          Contenido de la nueva sección aquí
        </p>
      </div>
    </>
  );
}

