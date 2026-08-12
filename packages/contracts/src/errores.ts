import { z } from 'zod';

export const campoErrorSchema = z.object({
  path: z.string(),
  message: z.string(),
  code: z.string(),
});

export const camposErrorSchema = z.object({
  statusCode: z.literal(400),
  error: z.literal('Bad Request'),
  message: z.array(campoErrorSchema),
});

export const errorSchema = z.object({
  statusCode: z.number().int(),
  error: z.string(),
  message: z.union([z.string(), z.array(campoErrorSchema)]),
});

export type CampoError = z.infer<typeof campoErrorSchema>;
export type CamposError = z.infer<typeof camposErrorSchema>;
export type ApiError = z.infer<typeof errorSchema>;
