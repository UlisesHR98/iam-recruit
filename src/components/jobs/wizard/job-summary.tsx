import type { JobSchema, JobSummaryProps } from "@/lib/types";
import { STATUS_LABELS, LOCATION_TYPES } from "./constants";

const AI_STRICT_MODE_LABELS: Record<number, string> = {
  1: "Muy flexible",
  2: "Flexible",
  3: "Algo flexible",
  4: "Moderadamente flexible",
  5: "Balanceado",
  6: "Moderadamente estricto",
  7: "Algo estricto",
  8: "Estricto",
  9: "Muy estricto",
  10: "Máxima exigencia",
};

const formatLocation = (values: JobSchema): string => {
  const locationType = LOCATION_TYPES.find(
    (lt) => lt.value === values.location_type
  );
  const typeLabel = locationType?.label || values.location_type;

  if (values.location_type === "Remote") {
    return typeLabel;
  }

  const parts: string[] = [typeLabel];
  if (values.location_country) {
    parts.push(values.location_country);
  }
  if (values.location_city) {
    parts.push(values.location_city);
  }

  return parts.join(", ");
};

export function JobSummary({ values, areas = [] }: JobSummaryProps) {
  const areaMap = new Map(areas.map((area) => [area.key, area.name]));
  const areaName = values.area
    ? areaMap.get(values.area) || values.area
    : undefined;

  return (
    <div className="border border-border rounded-lg p-6 bg-muted/30">
      <h3 className="text-lg font-semibold mb-4">Resumen de la vacante</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Informacion basica
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SummaryField label="Area" value={areaName} />
            <SummaryField label="Rol" value={values.role} />
            <SummaryField label="Ubicacion" value={formatLocation(values)} />
            <SummaryField label="Estado" value={STATUS_LABELS[values.status]} />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Criterios principales
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SummaryField
              label="Años de experiencia minima"
              value={`${values.min_experience_years} anos`}
            />
            <SummaryField
              label="Educacion minima"
              value={values.min_education}
            />
            <div className="sm:col-span-2">
              <span className="text-xs text-muted-foreground">
                Habilidades requeridas
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {values.required_skills.length > 0 ? (
                  values.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {(values.salary_min !== undefined ||
          values.salary_max !== undefined) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Compensación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {values.salary_min !== undefined && (
                <SummaryField
                  label="Salario mínimo"
                  value={`$${values.salary_min.toLocaleString()}`}
                />
              )}
              {values.salary_max !== undefined && (
                <SummaryField
                  label="Salario máximo"
                  value={`$${values.salary_max.toLocaleString()}`}
                />
              )}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Configuración IA
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SummaryField
              label="Modo de evaluación"
              value={`${values.ai_strict_mode} - ${AI_STRICT_MODE_LABELS[values.ai_strict_mode] || "Balanceado"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}
