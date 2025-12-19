"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, Filter, ChevronDown, Plus, Loader2 } from "lucide-react";
import type { JobsTableProps } from "@/lib/types";

import { useJobs } from "@/hooks/use-jobs";
import { useJobAreas } from "@/hooks/use-job-areas";
import { useJobDetails } from "@/hooks/use-job-details";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUserDateTime } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { buildJobColumns } from "@/components/jobs/jobs-columns";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

const statusLabels: Record<"open" | "draft" | "closed", string> = {
  open: "Abierto",
  draft: "Borrador",
  closed: "Cerrado",
};

const locationTypeLabels: Record<"Remote" | "Hybrid" | "In-Person", string> = {
  Remote: "Remoto",
  Hybrid: "Híbrido",
  "In-Person": "Presencial",
};

const formatJobLocation = (details: {
  location_type: "Remote" | "Hybrid" | "In-Person";
  location_country: string | null;
  location_city: string | null;
}): string => {
  const typeLabel =
    locationTypeLabels[details.location_type] || details.location_type;

  if (details.location_type === "Remote") {
    return typeLabel;
  }

  const parts = [typeLabel];
  if (details.location_country) {
    parts.push(details.location_country);
  }
  if (details.location_city) {
    parts.push(details.location_city);
  }

  return parts.join(", ");
};

export function JobsTable({ onEditJob, onCreateJob }: JobsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>("open");
  const [limit, setLimit] = useState(10);
  const [limitInput, setLimitInput] = useState("10");
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Applied filters (used for API calls)
  const [appliedAreaFilter, setAppliedAreaFilter] = useState<string | null>(
    null
  );
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string | null>(
    "open"
  );
  const [appliedLimit, setAppliedLimit] = useState(10);

  const { jobs, isLoading } = useJobs({
    limit: appliedLimit,
    status: appliedStatusFilter as "open" | "draft" | "closed" | undefined,
    area_id: appliedAreaFilter || undefined,
  });

  const hasPendingFilters = useMemo(
    () =>
      areaFilter !== appliedAreaFilter ||
      statusFilter !== appliedStatusFilter ||
      limit !== appliedLimit,
    [
      areaFilter,
      appliedAreaFilter,
      statusFilter,
      appliedStatusFilter,
      limit,
      appliedLimit,
    ]
  );

  const applyFilters = useCallback(() => {
    const validLimit = parseInt(limitInput) || 10;
    setLimit(validLimit);
    setLimitInput(validLimit.toString());
    setAppliedAreaFilter(areaFilter);
    setAppliedStatusFilter(statusFilter);
    setAppliedLimit(validLimit);
    setFiltersOpen(false);
  }, [limitInput, areaFilter, statusFilter]);

  const handleLimitChange = useCallback((value: string) => {
    setLimitInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setLimit(numValue);
    }
  }, []);

  const handleLimitBlur = useCallback(() => {
    const numValue = parseInt(limitInput);
    if (isNaN(numValue) || numValue < 1) {
      setLimitInput("10");
      setLimit(10);
    } else {
      setLimitInput(numValue.toString());
      setLimit(numValue);
    }
  }, [limitInput]);

  useEffect(() => {
    if (filtersOpen) {
      setLimitInput(limit.toString());
    }
  }, [filtersOpen, limit]);

  const { areas, isLoading: isLoadingAreas } = useJobAreas({
    activeOnly: true,
  });

  const {
    details,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useJobDetails(selectedJobId);

  const filteredData = useMemo(
    () =>
      jobs.filter((job) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          query === "" ||
          job.role.toLowerCase().includes(query) ||
          job.area_name.toLowerCase().includes(query) ||
          job.id.toLowerCase().includes(query);

        return matchesSearch;
      }),
    [jobs, searchQuery]
  );

  const handleViewDetails = useCallback((id: string) => {
    setSelectedJobId(id);
    setDetailsOpen(true);
  }, []);

  const handleViewApplications = useCallback(
    (id: string) => {
      router.push(`/vacantes/${id}/candidatos`);
    },
    [router]
  );

  const columns = useMemo(
    () =>
      buildJobColumns({
        onViewDetails: handleViewDetails,
        onEdit: onEditJob,
        onViewApplications: handleViewApplications,
        areas,
      }),
    [handleViewDetails, onEditJob, handleViewApplications, areas]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título, área o ID..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
              className="sm:hidden gap-2"
            >
              <Filter className="size-4" />
              <span>Filtros</span>
              {hasPendingFilters && (
                <span className="ml-1 size-2 rounded-full bg-primary" />
              )}
            </Button>

            <div className="sm:hidden flex items-center gap-1.5 flex-wrap min-w-0">
              {appliedLimit !== 10 && (
                <Badge variant="secondary" className="text-xs">
                  {appliedLimit} registros
                </Badge>
              )}
              {appliedAreaFilter && (
                <Badge
                  variant="secondary"
                  className="text-xs truncate max-w-[120px]"
                >
                  {areas.find((area) => area.id === appliedAreaFilter)?.name ||
                    appliedAreaFilter}
                </Badge>
              )}
              {appliedStatusFilter && appliedStatusFilter !== "open" && (
                <Badge variant="secondary" className="text-xs">
                  {
                    statusLabels[
                      appliedStatusFilter as "open" | "draft" | "closed"
                    ]
                  }
                </Badge>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-1">
            <div className="relative w-[120px]">
              <Input
                type="number"
                placeholder="Límite"
                value={limitInput}
                onChange={(e) => handleLimitChange(e.target.value)}
                onBlur={handleLimitBlur}
                className={`h-9 text-sm pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  limit !== appliedLimit ? "border-primary" : ""
                }`}
                min="1"
                max="100"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                registros
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${
                    areaFilter !== appliedAreaFilter ? "border-primary" : ""
                  }`}
                  disabled={isLoadingAreas}
                >
                  {isLoadingAreas ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                    <Filter className="size-4 shrink-0" />
                  )}
                  <span>
                    Área:{" "}
                    {isLoadingAreas
                      ? "Cargando..."
                      : areaFilter
                      ? areas.find((area) => area.id === areaFilter)?.name ||
                        areaFilter
                      : "Todas"}
                  </span>
                  <ChevronDown className="size-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 max-h-[300px] overflow-y-auto"
              >
                {isLoadingAreas ? (
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-6">
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setAreaFilter(null)}>
                      Todas
                    </DropdownMenuItem>
                    {areas.map((area) => (
                      <DropdownMenuItem
                        key={area.id}
                        onClick={() => setAreaFilter(area.id)}
                      >
                        {area.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${
                    statusFilter !== appliedStatusFilter ? "border-primary" : ""
                  }`}
                >
                  <Filter className="size-4 shrink-0" />
                  <span>
                    Estado:{" "}
                    {statusFilter
                      ? statusLabels[
                          statusFilter as "open" | "draft" | "closed"
                        ]
                      : "Todos"}
                  </span>
                  <ChevronDown className="size-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("open")}>
                  Abierto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  Borrador
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("closed")}>
                  Cerrado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <Button
              onClick={applyFilters}
              size="sm"
              className="gap-2"
              disabled={!hasPendingFilters}
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Aplicar</span>
            </Button>

            {onCreateJob && (
              <Button onClick={onCreateJob} size="sm" className="gap-2">
                <Plus className="size-4" />
                <span className="hidden sm:inline">Crear</span>
              </Button>
            )}
          </div>
        </div>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Configura los filtros para buscar vacantes
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6 p-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Límite de registros
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Límite"
                    value={limitInput}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    onBlur={handleLimitBlur}
                    className={`pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      limit !== appliedLimit ? "border-primary" : ""
                    }`}
                    min="1"
                    max="100"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    registros
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Área</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={isLoadingAreas}
                    >
                      {isLoadingAreas ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          {areaFilter
                            ? areas.find((area) => area.id === areaFilter)
                                ?.name || areaFilter
                            : "Todas"}
                          <ChevronDown className="size-4" />
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                    {!isLoadingAreas && (
                      <>
                        <DropdownMenuItem onClick={() => setAreaFilter(null)}>
                          Todas
                        </DropdownMenuItem>
                        {areas.map((area) => (
                          <DropdownMenuItem
                            key={area.id}
                            onClick={() => setAreaFilter(area.id)}
                          >
                            {area.name}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {statusFilter
                        ? statusLabels[
                            statusFilter as "open" | "draft" | "closed"
                          ]
                        : "Todos"}
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("open")}>
                      Abierto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                      Borrador
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("closed")}>
                      Cerrado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={applyFilters}
                  className="w-full"
                  disabled={!hasPendingFilters}
                >
                  <Search className="size-4 mr-2" />
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <TableSkeleton columns={4} rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[500px] sm:min-w-0">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-2 sm:px-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllLeafColumns().length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No se encontraron vacantes
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-2 py-3 sm:px-4 sm:py-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Sheet
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedJobId(undefined);
          }
        }}
      >
        <SheetContent className="flex w-full max-w-[480px] flex-col gap-6 overflow-y-auto px-6 py-8 sm:max-w-[520px] sm:px-8 sm:py-10">
          <SheetHeader className="space-y-2 text-left">
            <SheetTitle className="text-xl sm:text-2xl">
              {isDetailsLoading
                ? "Detalles de la vacante"
                : details
                ? details.role
                : "Detalles de la vacante"}
            </SheetTitle>
            {isDetailsLoading ? (
              <Loading variant="header" />
            ) : (
              <SheetDescription className="text-sm sm:text-base">
                {details
                  ? `${details.area_name} · ${formatJobLocation(details)}`
                  : "Cargando información de la vacante"}
              </SheetDescription>
            )}
          </SheetHeader>

          {isDetailsLoading && (
            <Loading message="Cargando detalles..." variant="inline" />
          )}

          {!isDetailsLoading && detailsError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              Error al obtener la información de la vacante
            </div>
          )}

          {!isDetailsLoading && !detailsError && details && (
            <div className="space-y-7">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="text-sm sm:text-base font-medium font-mono">
                    {details.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="text-sm sm:text-base font-medium">
                    <Badge
                      variant={
                        details.status === "open"
                          ? "default"
                          : details.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {statusLabels[details.status]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Área</p>
                  <p className="text-sm sm:text-base font-medium">
                    {details.area_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="text-sm sm:text-base font-medium">
                    {formatJobLocation(details)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Años de experiencia mínima
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {details.min_experience_years} años
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Educación mínima
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {details.min_education}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Modo estricto de IA
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {details.ai_strict_mode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Token de ingesta de email
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    <Badge
                      variant={
                        details.email_ingest_token.active
                          ? "default"
                          : "secondary"
                      }
                    >
                      {details.email_ingest_token.active
                        ? "Activo"
                        : "Inactivo"}
                    </Badge>
                  </p>
                </div>
              </section>

              <section>
                <p className="mb-1 text-xs text-muted-foreground">
                  Habilidades requeridas
                </p>
                <div className="flex flex-wrap gap-2">
                  {details.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-primary/10 px-2 py-1 text-xs sm:text-sm text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {(details.salary_min !== null || details.salary_max !== null) && (
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {details.salary_min !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Salario mínimo
                      </p>
                      <p className="text-sm sm:text-base font-medium">
                        ${details.salary_min.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {details.salary_max !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Salario máximo
                      </p>
                      <p className="text-sm sm:text-base font-medium">
                        ${details.salary_max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {details.observations && (
                <section>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Observaciones
                  </p>
                  <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                    {details.observations}
                  </p>
                </section>
              )}

              <section className="border-t pt-3 text-[11px] sm:text-xs text-muted-foreground">
                Creado: {formatUserDateTime(details.created_at)} · Actualizado:{" "}
                {formatUserDateTime(details.updated_at)}
              </section>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
