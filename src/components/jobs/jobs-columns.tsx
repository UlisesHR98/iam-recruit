import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
} from "@/shared/constants/job-status";

function EmailBadge({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const emailDomain = process.env.NEXT_PUBLIC_EMAIL_DIRECTION || "";
  const email = emailDomain ? `${token}@${emailDomain}` : token;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Correo copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar el correo");
    }
  };

  const displayEmail = emailDomain
    ? email.length > 20
      ? `${email.slice(0, 17)}...`
      : email
    : `${token.slice(0, 8)}...`;

  return (
    <Badge
      variant="outline"
      className="cursor-pointer hover:bg-brand-orange/10 dark:hover:bg-brand-orange/20 hover:border-brand-orange/50 dark:hover:border-brand-orange/70 transition-colors font-mono text-xs border-brand-orange/30 dark:border-brand-orange/50 text-brand-orange dark:text-brand-orange w-[70px] sm:w-[120px] justify-center px-3 py-1.5 gap-1"
      onClick={handleCopy}
      title="Click para copiar"
    >
      {copied ? (
        <>
          <Check className="size-3 shrink-0" />
          <span className="whitespace-nowrap">Copiado</span>
        </>
      ) : (
        <>
          <Copy className="size-3 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap truncate">
            {displayEmail}
          </span>
          <span className="sm:hidden whitespace-nowrap truncate">
            {emailDomain ? email.slice(0, 10) : token.slice(0, 4)}
          </span>
        </>
      )}
    </Badge>
  );
}

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
            className="whitespace-nowrap w-[70px] sm:w-[100px] justify-center px-3 py-1.5 truncate"
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
              "rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap w-[70px] sm:w-[100px] justify-center flex items-center",
              JOB_STATUS_COLORS[status]
            )}
          >
            {JOB_STATUS_LABELS[status]}
          </span>
        );
      },
    },
    {
      id: "email",
      header: () => <span>Correo</span>,
      cell: ({ row }) => {
        const token = row.original.email_ingest_token?.token;

        if (!token) return null;

        return <EmailBadge token={token} />;
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
