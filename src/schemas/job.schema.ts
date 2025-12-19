import { z } from "zod";

export const jobSchema = z
  .object({
    area: z.string().min(1, { message: "El área es requerida" }),
    role: z.string().min(1, { message: "El rol es requerido" }),
    min_experience_years: z.number().int().min(0, {
      message: "Los años de experiencia deben ser un número válido",
    }),
    min_education: z
      .string()
      .min(1, { message: "La educación mínima es requerida" }),
    required_skills: z
      .array(z.string())
      .min(1, { message: "Al menos una habilidad es requerida" }),
    location_type: z.enum(["Remote", "Hybrid", "In-Person"], {
      message: "El tipo de ubicación es requerido",
    }),
    location_country: z.string(),
    location_city: z.string(),
    salary_min: z
      .number()
      .min(0, { message: "El salario mínimo debe ser un número válido" })
      .optional(),
    salary_max: z
      .number()
      .min(0, { message: "El salario máximo debe ser un número válido" })
      .optional(),
    observations: z.string().optional(),
    status: z.enum(["draft", "open", "closed"]),
    ai_strict_mode: z.number().int().min(1).max(10).default(5),
  })
  .refine(
    (data) => {
      if (data.salary_min !== undefined && data.salary_max !== undefined) {
        return data.salary_min <= data.salary_max;
      }
      return true;
    },
    {
      message: "El salario mínimo debe ser menor o igual al salario máximo",
      path: ["salary_max"],
    }
  )
  .refine(
    (data) => {
      if (
        data.location_type === "Hybrid" ||
        data.location_type === "In-Person"
      ) {
        return data.location_country.trim().length > 0;
      }
      return true;
    },
    {
      message: "El país es requerido para ubicaciones Híbridas o Presenciales",
      path: ["location_country"],
    }
  )
  .refine(
    (data) => {
      if (
        data.location_type === "Hybrid" ||
        data.location_type === "In-Person"
      ) {
        return data.location_city.trim().length > 0;
      }
      return true;
    },
    {
      message:
        "La ciudad es requerida para ubicaciones Híbridas o Presenciales",
      path: ["location_city"],
    }
  );

// JobSchema is now defined in types.ts
