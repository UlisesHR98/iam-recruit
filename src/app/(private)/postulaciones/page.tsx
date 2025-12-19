"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { ApplicationCard } from "@/components/applications/application-card";
import { UploadDocumentDialog } from "@/components/applications/upload-document-dialog";
import { CardsSkeleton } from "@/components/skeletons/cards-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

const ITEMS_PER_PAGE = 20;

const statusOptions: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "applied", label: "Postulado" },
  { value: "in_review", label: "En revisión" },
  { value: "interviewing", label: "Entrevistando" },
  { value: "offered", label: "Oferta extendida" },
  { value: "hired", label: "Contratado" },
  { value: "rejected", label: "Rechazado" },
  { value: "withdrawn", label: "Retirado" },
];

const orderOptions: { value: string; label: string }[] = [
  { value: "applied_at", label: "Fecha de aplicación" },
  { value: "created_at", label: "Fecha de creación" },
];

export default function PostulacionesPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [orderBy, setOrderBy] = useState<string>("applied_at");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { jobs } = useJobs({ limit: 100 });

  const { applications, isLoading, isError } = useApplications({
    status: statusFilter !== "all" ? statusFilter : undefined,
    job_id: jobFilter !== "all" ? jobFilter : undefined,
    skip: page * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    order_by: orderBy,
    order_direction: orderDirection,
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ApplicationStatus | "all");
    setPage(0);
  };

  const handleJobChange = (value: string) => {
    setJobFilter(value);
    setPage(0);
  };

  const handleOrderChange = (value: string) => {
    setOrderBy(value);
    setPage(0);
  };

  const handleDirectionChange = (value: string) => {
    setOrderDirection(value as "asc" | "desc");
    setPage(0);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">Postulaciones</h1>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 size-4" />
              Subir documento
            </Button>
          </div>

          <UploadDocumentDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
          />

          <div className="flex flex-wrap gap-4">
            <div className="h-9 w-[180px] animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-[200px] animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-[200px] animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-[140px] animate-pulse rounded-md bg-muted" />
          </div>

          <CardsSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center p-8">
          <p className="text-destructive">Error al cargar las postulaciones</p>
        </div>
      </div>
    );
  }

  const hasMore = applications.length === ITEMS_PER_PAGE;
  const showPagination = page > 0 || hasMore;

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Postulaciones</h1>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 size-4" />
            Subir documento
          </Button>
        </div>

        <UploadDocumentDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />

        <div className="flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobFilter} onValueChange={handleJobChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Vacante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las vacantes</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={handleOrderChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {orderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={orderDirection} onValueChange={handleDirectionChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Dirección" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descendente</SelectItem>
              <SelectItem value="asc">Ascendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {applications.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No hay postulaciones</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>

            {showPagination && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page + 1}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!hasMore}
                >
                  Siguiente
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
