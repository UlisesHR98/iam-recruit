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
    location: z.string().min(1, { message: "La ubicación es requerida" }),
    salary_min: z
      .number()
      .int()
      .min(0, { message: "El salario mínimo debe ser un número válido" })
      .optional(),
    salary_max: z
      .number()
      .int()
      .min(0, { message: "El salario máximo debe ser un número válido" })
      .optional(),
    observations: z.string().optional(),
    status: z.enum(["draft", "open", "closed"]),
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
  );

// JobSchema is now defined in types.ts
