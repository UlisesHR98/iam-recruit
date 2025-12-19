import { Controller, type UseFormReturn } from "react-hook-form";
import {
  Briefcase,
  GraduationCap,
  Code,
  DollarSign,
  FileText,
} from "lucide-react";

import type { JobSchema } from "@/lib/types";
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
import { EDUCATION_LEVELS, LOCATIONS } from "./constants";
import { JobSummary } from "@/components/jobs/wizard/job-summary";
import type { JobArea, StepProps, SkillsStepProps } from "@/lib/types";

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
        name="location"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Ubicacion</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Selecciona una ubicacion" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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
              Anos de experiencia minima: {field.value}
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
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} className="pl-10">
                  <SelectValue placeholder="Selecciona el nivel educativo" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export function SalaryStep({ form }: StepProps) {
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
