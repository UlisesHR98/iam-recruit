import type { ApplicationStatus } from "@/lib/types";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Postulado",
  in_review: "En revisión",
  interviewing: "Entrevistando",
  offered: "Oferta extendida",
  hired: "Contratado",
  rejected: "Rechazado",
  withdrawn: "Retirado",
};

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20",
  in_review:
    "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20",
  interviewing:
    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20",
  offered:
    "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20",
  hired:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
  rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20",
  withdrawn:
    "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20",
};

export function getApplicationStatusStyle(status: ApplicationStatus): string {
  return APPLICATION_STATUS_STYLES[status];
}

