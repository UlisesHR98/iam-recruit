import { z } from "zod";

export const registerSchema = z
  .object({
    company_name: z
      .string()
      .min(2, {
        message: "El nombre de la empresa debe tener al menos 2 caracteres",
      })
      .max(100, {
        message: "El nombre de la empresa no puede exceder 100 caracteres",
      }),
    email: z.email({ message: "El correo electrónico no es válido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una mayúscula",
      })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una minúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      }),
    confirmPassword: z.string({
      message: "Debes confirmar tu contraseña",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// RegisterSchema is now defined in types.ts
