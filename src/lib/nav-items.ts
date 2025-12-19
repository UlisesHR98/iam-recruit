import type { NavItem } from "@/lib/types";
export const NAV_ITEMS: NavItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/inicio",
    icon: "home",
  },
  {
    id: "vacantes",
    label: "Vacantes",
    href: "/vacantes",
    icon: "briefcase",
  },
  {
    id: "postulaciones",
    label: "Postulaciones",
    href: "/postulaciones",
    icon: "file-text",
  },
  {
    id: "settings",
    label: "Configuración",
    href: "/settings",
    icon: "settings",
  },
];
