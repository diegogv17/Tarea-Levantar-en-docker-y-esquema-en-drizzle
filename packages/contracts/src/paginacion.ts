import { z } from 'zod';
import { usuarioSchema } from './usuario';

export const listaUsuariosQuerySchema = z.object({
  page: z.coerce
    .number({ message: 'page debe ser un número' })
    .int()
    .min(1)
    .default(1),
  limit: z.coerce
    .number({ message: 'limit debe ser un número' })
    .int()
    .min(1)
    .max(100)
    .default(10),
});

export const paginacionMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const paginaUsuariosSchema = z.object({
  data: z.array(usuarioSchema),
  meta: paginacionMetaSchema,
});

export type ListaUsuariosQuery = z.infer<typeof listaUsuariosQuerySchema>;
export type PaginacionMeta = z.infer<typeof paginacionMetaSchema>;
export type PaginaUsuarios = z.infer<typeof paginaUsuariosSchema>;
