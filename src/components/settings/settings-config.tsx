import { Briefcase } from "lucide-react";
import { JobAreasSection } from "./job-areas-section";

export interface SettingsSectionConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description?: string;
}

/**
 * Configuración de secciones de Settings
 *
 * Para agregar una nueva sección:
 * 1. Crea un componente en `src/components/settings/[nombre]-section.tsx`
 * 2. El componente debe retornar JSX con la estructura:
 *    - Un div con flex justify-between para el header (título y botones)
 *    - El contenido principal dentro de un contenedor
 * 3. Importa el componente y su icono aquí
 * 4. Agrega la configuración al array SETTINGS_SECTIONS
 *
 * Ejemplo:
 * ```tsx
 * import { Settings } from "lucide-react";
 * import { NewSection } from "./new-section";
 *
 * export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
 *   // ... secciones existentes
 *   {
 *     id: "new-section",
 *     label: "Nueva Sección",
 *     icon: <Settings className="size-4" />,
 *     component: <NewSection />,
 *     description: "Descripción opcional",
 *   },
 * ];
 * ```
 */
export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  {
    id: "job-areas",
    label: "Áreas de Trabajo",
    icon: <Briefcase className="size-4" />,
    component: <JobAreasSection />,
    description: "Gestiona las áreas de trabajo disponibles",
  },
];

