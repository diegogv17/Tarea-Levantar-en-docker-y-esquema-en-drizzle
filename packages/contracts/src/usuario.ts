import { z } from 'zod';

export const usuarioSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1).max(100),
  email: z.string().email().max(255),
  activo: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('El email no es válido').max(255),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255),
  activo: z.boolean().optional(),
});

export const actualizarUsuarioSchema = crearUsuarioSchema.partial();

export const usuarioIdSchema = z.coerce.number().int().positive();

export type Usuario = z.infer<typeof usuarioSchema>;
export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioInput = z.infer<typeof actualizarUsuarioSchema>;
export type UsuarioId = z.infer<typeof usuarioIdSchema>;
