// schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "El correo electrónico no es válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

// LoginSchema is now defined in types.ts
