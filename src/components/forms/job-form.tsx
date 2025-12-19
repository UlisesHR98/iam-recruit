"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  DollarSign,
  GraduationCap,
  Code,
  FileText,
} from "lucide-react";

import { jobSchema } from "@/schemas/job.schema";
import type { JobSchema } from "@/lib/types";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { useJobAreas } from "@/hooks/use-job-areas";
import { LOCATION_TYPES, COUNTRIES } from "@/components/jobs/wizard/constants";

export default function JobForm() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const { areas } = useJobAreas({ activeOnly: true });

  const form = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      area: "",
      role: "",
      min_experience_years: 0,
      min_education: "",
      required_skills: [],
      location_type: "Remote",
      location_country: "",
      location_city: "",
      salary_min: undefined,
      salary_max: undefined,
      observations: "",
      status: "draft",
    },
  });

  const requiredSkills = form.watch("required_skills");

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !requiredSkills.includes(skill)) {
      form.setValue("required_skills", [...requiredSkills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    form.setValue(
      "required_skills",
      requiredSkills.filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data: JobSchema) => {
    setIsLoading(true);

    try {
      // Find area_id from area key
      const selectedArea = areas.find((area) => area.key === data.area);
      if (!selectedArea) {
        throw new Error("El área seleccionada no es válida");
      }

      // Transform data to match backend format
      const payload = {
        area_id: selectedArea.id,
        role: data.role,
        min_experience_years: data.min_experience_years,
        min_education: data.min_education,
        required_skills: data.required_skills,
        location_type: data.location_type,
        location_country:
          data.location_type === "Remote"
            ? null
            : data.location_country.trim() || null,
        location_city:
          data.location_type === "Remote"
            ? null
            : data.location_city.trim() || null,
        salary_min: data.salary_min ?? null,
        salary_max: data.salary_max ?? null,
        observations: data.observations || null,
        status: data.status,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Error al crear la vacante",
        }));
        throw new Error(error.message || "Error al crear la vacante");
      }

      toast.success("Vacante creada exitosamente");
      form.reset({
        area: "",
        role: "",
        min_experience_years: 0,
        min_education: "",
        required_skills: [],
        location_type: "Remote",
        location_country: undefined,
        location_city: undefined,
        salary_min: undefined,
        salary_max: undefined,
        observations: "",
        status: "draft",
      });
      setSkillInput("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al crear la vacante"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-2xl"
    >
      <FieldGroup>
        <Controller
          name="area"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Área</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Selecciona un área" />
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

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="min_experience_years"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Años de experiencia mínima
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  min="0"
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="min_education"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Educación mínima</FieldLabel>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Field>
          <FieldLabel>Habilidades requeridas</FieldLabel>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Code className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Python, FastAPI, PostgreSQL"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="pl-10"
              />
            </div>
            <Button type="button" onClick={addSkill} variant="outline">
              Agregar
            </Button>
          </div>
          {requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-md"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {form.formState.errors.required_skills && (
            <FieldError errors={[form.formState.errors.required_skills]} />
          )}
        </Field>

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
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
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

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="salary_min"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Salario mínimo</FieldLabel>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
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

          <Controller
            name="salary_max"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Salario máximo</FieldLabel>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
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
        </div>

        <Controller
          name="observations"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                <textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  placeholder="Full-time position"
                  aria-invalid={fieldState.invalid}
                  className="w-full min-h-[80px] rounded-xl border border-input bg-transparent px-3 py-2 pl-10 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                />
              </div>
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
              <select
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="w-full h-9 rounded-xl border border-input bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              >
                <option value="draft">Borrador</option>
                <option value="open">Abierto</option>
                <option value="closed">Cerrado</option>
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creando vacante..." : "Crear vacante"}
        </Button>
      </FieldGroup>
    </form>
  );
}
