"use client";

import { useState } from "react";
import { useApplication } from "@/hooks/use-application";
import { useJobDetails } from "@/hooks/use-job-details";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { formatUserDateTime, cn } from "@/lib/utils";
import { ChevronLeft, Loader2 } from "lucide-react";
import type { ApplicationStatus, AIRecommendation } from "@/lib/types";
import { PostulationDetailsSkeleton } from "@/components/skeletons/postulation-detail-skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { ensureValidToken, refreshAccessToken } from "@/lib/refresh-token";
import {
  APPLICATION_STATUS_LABELS,
  getApplicationStatusStyle,
} from "@/shared/constants/application-status";
import { AI_RECOMMENDATION_LABELS } from "@/shared/constants/ai-recommendation";

const sourceLabels: Record<string, string> = {
  manual_upload: "Carga manual",
  linkedin: "LinkedIn",
  website: "Sitio web",
  referral: "Referido",
  other: "Otro",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getRecommendationColor(recommendation: AIRecommendation): string {
  const colors: Record<AIRecommendation, string> = {
    strong_fit: "text-green-600 dark:text-green-400",
    good_fit: "text-blue-600 dark:text-blue-400",
    neutral: "text-yellow-600 dark:text-yellow-400",
    weak_fit: "text-orange-600 dark:text-orange-400",
    not_recommended: "text-red-600 dark:text-red-400",
  };
  return colors[recommendation];
}

export function PostulationDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const { application, isLoading, isError, mutate } = useApplication(id);
  const { details: jobDetails } = useJobDetails(application?.job_id);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application || application.status === newStatus) return;

    setIsUpdatingStatus(true);
    try {
      let accessToken = await ensureValidToken();

      if (!accessToken) {
        toast.error("No estás autenticado");
        return;
      }

      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      let finalResponse = response;
      let updatedApplication;

      if (response.status === 401) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
          useAuthStore.getState().clearAuth();
          toast.error("Sesión expirada");
          return;
        }

        finalResponse = await fetch(`/api/applications/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        });

        if (!finalResponse.ok) {
          const errorData = await finalResponse.json();
          toast.error(errorData.message || "Error al actualizar el estatus");
          return;
        }
      } else if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al actualizar el estatus");
        return;
      }

      updatedApplication = await finalResponse.json();
      await mutate(updatedApplication, { revalidate: false });
      setSelectedStatus(null);
      toast.success("Estatus actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el estatus");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmStatusChange = () => {
    if (selectedStatus && selectedStatus !== application?.status) {
      handleStatusChange(selectedStatus);
    }
  };

  const currentStatus = selectedStatus ?? application?.status;
  const hasStatusChanged =
    selectedStatus !== null && selectedStatus !== application?.status;

  if (isLoading) {
    return <PostulationDetailsSkeleton />;
  }

  if (isError || !application) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/postulaciones")}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Ver postulaciones
            </Button>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-destructive">Error al cargar la postulación</p>
          </div>
        </div>
      </div>
    );
  }

  const candidateName = application.candidate
    ? application.candidate.first_name || application.candidate.last_name
      ? `${application.candidate.first_name || ""} ${
          application.candidate.last_name || ""
        }`.trim()
      : "Sin nombre"
    : "Sin nombre";

  const candidateLocation = application.candidate
    ? [application.candidate.location, application.candidate.country]
        .filter(Boolean)
        .join(", ") || null
    : null;

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/postulaciones")}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Ver postulaciones
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold">{candidateName}</h1>
                  {application.candidate?.email && (
                    <p className="text-sm text-muted-foreground">
                      {application.candidate.email}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center shrink-0 flex-wrap transition-all duration-300",
                    hasStatusChanged ? "gap-3" : "gap-0 sm:gap-3"
                  )}
                >
                  {isUpdatingStatus ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-transparent">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm">Actualizando...</span>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={currentStatus}
                        onValueChange={(value) =>
                          setSelectedStatus(value as ApplicationStatus)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[220px]">
                          <SelectValue>
                            {currentStatus && (
                              <span
                                className={cn(
                                  "text-sm font-medium px-2.5 py-1 rounded-md",
                                  getApplicationStatusStyle(currentStatus)
                                )}
                              >
                                {APPLICATION_STATUS_LABELS[currentStatus]}
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-[220px]">
                          {Object.entries(APPLICATION_STATUS_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <span
                                  className={cn(
                                    "text-sm font-medium px-2.5 py-1 rounded-md",
                                    getApplicationStatusStyle(
                                      value as ApplicationStatus
                                    )
                                  )}
                                >
                                  {label}
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          hasStatusChanged
                            ? "max-w-[120px] opacity-100"
                            : "max-w-0 opacity-0"
                        )}
                      >
                        <Button
                          size="sm"
                          onClick={handleConfirmStatusChange}
                          className="shrink-0 whitespace-nowrap"
                        >
                          Actualizar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                {application.candidate?.phone && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">
                      {application.candidate.phone}
                    </p>
                  </div>
                )}
                {candidateLocation && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ubicación</p>
                    <p className="text-sm font-medium">{candidateLocation}</p>
                  </div>
                )}
                {jobDetails && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Vacante</p>
                    <p className="text-sm font-medium">{jobDetails.role}</p>
                  </div>
                )}
                {jobDetails && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="text-sm font-medium">
                      {jobDetails.area_name}
                    </p>
                  </div>
                )}
              </div>

              {application.rejected_reason && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Motivo de rechazo</p>
                    <p className="text-sm text-muted-foreground">
                      {application.rejected_reason}
                    </p>
                  </div>
                </>
              )}
            </div>

            {application.ai_summary && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Resumen de evaluación</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {application.ai_summary}
                </p>
              </div>
            )}

            {(application.ai_strengths?.length ||
              application.ai_weaknesses?.length ||
              application.ai_key_skills_match?.length ||
              application.ai_missing_requirements?.length) && (
              <div className="rounded-xl border bg-card p-6 space-y-6">
                <h2 className="text-lg font-semibold">Análisis detallado</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  {application.ai_strengths?.length ? (
                    <div className="space-y-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
                      <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Fortalezas
                      </h3>
                      <ul className="space-y-2.5">
                        {application.ai_strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="text-sm text-foreground flex items-start gap-2.5"
                          >
                            <span className="text-green-600 dark:text-green-400 mt-0.5 shrink-0 font-bold">
                              ✓
                            </span>
                            <span className="leading-relaxed">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {application.ai_weaknesses?.length ? (
                    <div className="space-y-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
                      <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                        Áreas de mejora
                      </h3>
                      <ul className="space-y-2.5">
                        {application.ai_weaknesses.map((weakness, index) => (
                          <li
                            key={index}
                            className="text-sm text-foreground flex items-start gap-2.5"
                          >
                            <span className="text-orange-600 dark:text-orange-400 mt-0.5 shrink-0 font-bold">
                              →
                            </span>
                            <span className="leading-relaxed">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {application.ai_key_skills_match?.length ? (
                    <div className="space-y-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 sm:col-span-2">
                      <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Habilidades clave coincidentes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {application.ai_key_skills_match.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {application.ai_missing_requirements?.length ? (
                    <div className="space-y-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 sm:col-span-2">
                      <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                        Requisitos faltantes
                      </h3>
                      <ul className="space-y-2.5">
                        {application.ai_missing_requirements.map(
                          (requirement, index) => (
                            <li
                              key={index}
                              className="text-sm text-foreground flex items-start gap-2.5"
                            >
                              <span className="text-red-600 dark:text-red-400 mt-0.5 shrink-0 font-bold">
                                ×
                              </span>
                              <span className="leading-relaxed">
                                {requirement}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(application.ai_score !== null ||
              application.ai_recommendation) && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold">Evaluación IA</h3>
                {application.ai_score !== null && (
                  <div className="text-center py-4">
                    <div
                      className={cn(
                        "text-4xl font-bold mb-2",
                        getScoreColor(application.ai_score)
                      )}
                    >
                      {Math.round(application.ai_score)}
                    </div>
                    <p className="text-xs text-muted-foreground">Puntuación</p>
                  </div>
                )}
                {application.ai_recommendation && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Recomendación
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        getRecommendationColor(application.ai_recommendation)
                      )}
                    >
                      {AI_RECOMMENDATION_LABELS[application.ai_recommendation]}
                    </p>
                  </div>
                )}
                {application.ai_evaluated_at && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">Evaluado el</p>
                    <p className="text-xs font-medium">
                      {formatUserDateTime(application.ai_evaluated_at)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="text-sm font-semibold">Información adicional</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Origen</p>
                  <p className="text-sm font-medium">
                    {sourceLabels[application.source] || application.source}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Fecha de aplicación
                  </p>
                  <p className="text-sm font-medium">
                    {formatUserDateTime(application.applied_at)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Creado</p>
                  <p className="text-sm font-medium">
                    {formatUserDateTime(application.created_at)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Actualizado</p>
                  <p className="text-sm font-medium">
                    {formatUserDateTime(application.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
