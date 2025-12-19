import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { mutate } from "swr";
import type { JobArea } from "@/lib/types";

interface JobAreaFormData {
  key: string;
  name: string;
  color: string;
  order: number;
  is_active: boolean;
}

export function useJobAreaMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const createOrUpdate = async (
    data: JobAreaFormData,
    areaId?: string
  ): Promise<JobArea | null> => {
    setIsSubmitting(true);

    try {
      const url = areaId ? `/api/job-areas/${areaId}` : "/api/job-areas";
      const method = areaId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al guardar el área");
      }

      toast.success(
        areaId
          ? "Área de trabajo actualizada exitosamente"
          : "Área de trabajo creada exitosamente"
      );

      await mutate("/job-areas");
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al procesar la solicitud"
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteArea = async (areaId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/job-areas/${areaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el área");
      }

      toast.success("Área de trabajo eliminada exitosamente");
      await mutate("/job-areas");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al procesar la solicitud"
      );
      return false;
    }
  };

  return {
    createOrUpdate,
    deleteArea,
    isSubmitting,
  };
}

