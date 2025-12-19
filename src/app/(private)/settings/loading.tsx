import { Loading } from "@/components/ui/loading";

export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>
      <Loading message="Cargando configuración..." variant="inline" />
    </div>
  );
}

