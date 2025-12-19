import SettingsClient from "@/components/settings/settings-client";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold">Configuración</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gestiona la configuración de tu cuenta y áreas de trabajo
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}

