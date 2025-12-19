import { Controller } from "react-hook-form";
import {
  Briefcase,
  GraduationCap,
  Code,
  DollarSign,
  FileText,
  MapPin,
  Brain,
} from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LOCATION_TYPES, COUNTRIES } from "./constants";
import { JobSummary } from "@/components/jobs/wizard/job-summary";
import type { StepProps, SkillsStepProps } from "@/lib/types";

export function BasicInfoStep({ form, areas = [] }: StepProps) {
  return (
    <FieldGroup>
      <Controller
        name="area"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Area</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Selecciona un area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.key}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="role"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Rol</FieldLabel>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="Senior Software Engineer"
                aria-invalid={fieldState.invalid}
                className="pl-10"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="location_type"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Tipo de ubicación</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Selecciona un tipo de ubicación" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {(form.watch("location_type") === "Hybrid" ||
        form.watch("location_type") === "In-Person") && (
        <>
          <Controller
            name="location_country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>País</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="location_city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Ciudad</FieldLabel>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Ciudad de México"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-invalid={fieldState.invalid}
                    className="pl-10"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}

      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

export function RequirementsStep({
  form,
  skillInput,
  onSkillInputChange,
  onAddSkill,
  onRemoveSkill,
}: SkillsStepProps) {
  const requiredSkills = form.watch("required_skills");

  return (
    <FieldGroup>
      <Controller
        name="min_experience_years"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Años de experiencia minima: {field.value}
            </FieldLabel>
            <Slider
              id={field.name}
              min={0}
              max={20}
              step={1}
              value={[field.value]}
              onValueChange={(value) => field.onChange(value[0])}
              className="mt-4"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="min_education"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Educacion minima</FieldLabel>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="Bachelor's Degree"
                aria-invalid={fieldState.invalid}
                className="pl-10"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>Habilidades requeridas</FieldLabel>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Code className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Python, FastAPI, PostgreSQL"
              value={skillInput}
              onChange={(e) => onSkillInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddSkill();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button type="button" onClick={onAddSkill} variant="outline">
            Agregar
          </Button>
        </div>
        {requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {requiredSkills.map((skill: string) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-md"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="hover:text-destructive"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
        {form.formState.errors.required_skills && (
          <FieldError errors={[form.formState.errors.required_skills]} />
        )}
      </Field>
    </FieldGroup>
  );
}

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

export function SalaryStep({ form }: StepProps) {
  const aiStrictMode = form.watch("ai_strict_mode") || 5;

  return (
    <FieldGroup>
      <Controller
        name="salary_min"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Salario minimo (opcional)
            </FieldLabel>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="number"
                min="0"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="50000"
                aria-invalid={fieldState.invalid}
                className="pl-10"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="salary_max"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Salario maximo (opcional)
            </FieldLabel>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="number"
                min="0"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="80000"
                aria-invalid={fieldState.invalid}
                className="pl-10"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="ai_strict_mode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor={field.name} className="mb-0">
                Modo de evaluación IA
              </FieldLabel>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Define qué tan estricta será la IA al evaluar candidatos. Un valor
              más alto significa criterios más exigentes.
            </p>
            <div className="space-y-3">
              <Slider
                id={field.name}
                min={1}
                max={10}
                step={1}
                value={[field.value || 5]}
                onValueChange={(value) => field.onChange(value[0])}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Flexible</span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {aiStrictMode} - {AI_STRICT_MODE_LABELS[aiStrictMode]}
                </span>
                <span className="text-xs text-muted-foreground">Estricto</span>
              </div>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

export function ReviewStep({ form, areas = [] }: StepProps) {
  const formValues = form.watch();

  return (
    <div className="space-y-6">
      <FieldGroup>
        <Controller
          name="observations"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Observaciones (opcional)
              </FieldLabel>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                <Textarea
                  {...field}
                  id={field.name}
                  rows={6}
                  placeholder="Full-time position, benefits, etc."
                  aria-invalid={fieldState.invalid}
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <JobSummary values={formValues} areas={areas} />
    </div>
  );
}
