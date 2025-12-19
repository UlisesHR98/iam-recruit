import type { AIRecommendation } from "@/lib/types";

export const AI_RECOMMENDATION_LABELS: Record<AIRecommendation, string> = {
  strong_fit: "Excelente ajuste",
  good_fit: "Buen ajuste",
  moderate_fit: "Ajuste moderado",
  weak_fit: "Ajuste débil",
  not_recommended: "No recomendado",
};

