import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Job, JobArea, JobRow, JobTableActions } from "@/lib/types";

const statusColors: Record<Job["status"], string> = {
  open: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<Job["status"], string> = {
  open: "Abierto",
  draft: "Borrador",
  closed: "Cerrado",
};

export const buildJobColumns = ({
  onViewDetails,
  onEdit,
  onViewApplications,
  areas = [],
}: JobTableActions): ColumnDef<JobRow>[] => {
  const areaMap = new Map(areas.map((area) => [area.key, area.name]));
  const areaColorMap = new Map(areas.map((area) => [area.name, area.color]));

  return [
    {
      accessorKey: "role",
      header: () => (
        <span>
          <span className="sm:hidden">Título</span>
          <span className="hidden sm:inline">Título del trabajo</span>
        </span>
      ),
      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{job.role}</div>
            <div className="mt-1 text-xs text-muted-foreground hidden sm:block">
              ID: {job.id.slice(0, 8)}...
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "area",
      header: () => <span>Área</span>,
      cell: ({ row }) => {
        const areaKey = row.original.area_name;
        const areaName = areaMap.get(areaKey) || areaKey;
        const areaColor = areaColorMap.get(areaKey);

        return (
          <Badge
            variant="outline"
            className="whitespace-nowrap"
            style={
              areaColor
                ? {
                    borderColor: areaColor,
                    backgroundColor: `${areaColor}15`,
                    color: areaColor,
                  }
                : undefined
            }
          >
            {areaName}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <span>Estado</span>,
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
              statusColors[status]
            )}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onViewDetails?.(job.id)}
                  disabled={!onViewDetails}
                >
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onViewApplications?.(job.id)}
                  disabled={!onViewApplications}
                >
                  Ver postulaciones
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit?.(job.id)}
                  disabled={!onEdit}
                >
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" disabled>
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
