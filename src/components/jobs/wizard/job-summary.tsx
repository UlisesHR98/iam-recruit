import type { JobSchema, JobSummaryProps } from "@/lib/types";
import { STATUS_LABELS } from "./constants";

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
            <SummaryField label="Ubicacion" value={values.location} />
            <SummaryField label="Estado" value={STATUS_LABELS[values.status]} />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Criterios principales
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SummaryField
              label="Anos de experiencia minima"
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
              Compensacion
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {values.salary_min !== undefined && (
                <SummaryField
                  label="Salario minimo"
                  value={`$${values.salary_min.toLocaleString()}`}
                />
              )}
              {values.salary_max !== undefined && (
                <SummaryField
                  label="Salario maximo"
                  value={`$${values.salary_max.toLocaleString()}`}
                />
              )}
            </div>
          </div>
        )}
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
