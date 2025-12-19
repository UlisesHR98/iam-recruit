export const AREAS = [
  "Engineering",
  "Marketing",
  "Sales",
  "Design",
  "Product",
  "Data",
  "Operations",
  "HR",
] as const;

export const EDUCATION_LEVELS = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
] as const;

export const LOCATION_TYPES = [
  { value: "Remote", label: "Remoto" },
  { value: "Hybrid", label: "Híbrido" },
  { value: "In-Person", label: "Presencial" },
] as const;

// Lista de países comunes (puedes expandir esto)
export const COUNTRIES = [
  "México",
  "Estados Unidos",
  "Canadá",
  "España",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Ecuador",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Venezuela",
  "Brasil",
  "Costa Rica",
  "Panamá",
  "Guatemala",
  "República Dominicana",
  "Honduras",
  "El Salvador",
  "Nicaragua",
] as const;

export { JOB_STATUS_LABELS as STATUS_LABELS } from "@/shared/constants/job-status";
