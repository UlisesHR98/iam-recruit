"use client";

import { memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatUserDateTime } from "@/lib/utils";
import type {
  Application,
  AIRecommendation,
  ApplicationCardProps,
} from "@/lib/types";
import { useJobs } from "@/hooks/use-jobs";
import { TrendingUp, TrendingDown, Minus, Mail, Briefcase } from "lucide-react";
import {
  APPLICATION_STATUS_LABELS,
  getApplicationStatusStyle,
} from "@/shared/constants/application-status";

const recommendationLabels: Record<AIRecommendation, string> = {
  strong_fit: "Excelente",
  good_fit: "Bueno",
  neutral: "Neutral",
  weak_fit: "Débil",
  not_recommended: "No recomendado",
};

const recommendationColors: Record<AIRecommendation, string> = {
  strong_fit: "text-green-600 dark:text-green-400",
  good_fit: "text-blue-600 dark:text-blue-400",
  neutral: "text-yellow-600 dark:text-yellow-400",
  weak_fit: "text-orange-600 dark:text-orange-400",
  not_recommended: "text-red-600 dark:text-red-400",
};

const recommendationIcons: Record<AIRecommendation, typeof TrendingUp> = {
  strong_fit: TrendingUp,
  good_fit: TrendingUp,
  neutral: Minus,
  weak_fit: TrendingDown,
  not_recommended: TrendingDown,
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export const ApplicationCard = memo(function ApplicationCard({
  application,
  fromJobId,
}: ApplicationCardProps) {
  const router = useRouter();
  const { jobs } = useJobs({ limit: 1000 });
  
  const job = useMemo(
    () => jobs.find((j) => j.id === application.job_id),
    [jobs, application.job_id]
  );

  const candidateName = useMemo(() => {
    if (!application.candidate) return "Sin nombre";
    if (application.candidate.first_name || application.candidate.last_name) {
      return `${application.candidate.first_name || ""} ${
        application.candidate.last_name || ""
      }`.trim();
    }
    return "Sin nombre";
  }, [application.candidate]);

  const handleClick = useCallback(() => {
    router.push(`/postulaciones/${application.id}`);
  }, [router, application.id]);

  const RecommendationIcon = useMemo(
    () =>
      application.ai_recommendation
        ? recommendationIcons[application.ai_recommendation]
        : null,
    [application.ai_recommendation]
  );

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg overflow-hidden h-full"
    >
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary line-clamp-2">
              {candidateName}
            </h3>
            {application.candidate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{application.candidate.email}</span>
              </div>
            )}
          </div>
        </div>

        {job && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Briefcase className="size-4 shrink-0" />
            <span className="truncate font-medium">{job.role}</span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "shrink-0 text-xs font-medium px-2.5 py-1 rounded-md",
              getApplicationStatusStyle(application.status)
            )}
          >
            {APPLICATION_STATUS_LABELS[application.status]}
          </span>
          {application.ai_score !== null && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  "text-sm font-semibold",
                  getScoreColor(application.ai_score)
                )}
              >
                {Math.round(application.ai_score)}
              </span>
              {application.ai_recommendation && RecommendationIcon && (
                <RecommendationIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    recommendationColors[application.ai_recommendation]
                  )}
                />
              )}
              {application.ai_recommendation && (
                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    recommendationColors[application.ai_recommendation]
                  )}
                >
                  {recommendationLabels[application.ai_recommendation]}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t text-xs text-muted-foreground mt-auto">
          <span className="capitalize truncate">
            {application.source.replace("_", " ")}
          </span>
          <span className="shrink-0 whitespace-nowrap">
            {formatUserDateTime(application.applied_at)}
          </span>
        </div>
      </div>
    </div>
  );
});
