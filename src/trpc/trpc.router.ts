import { initTRPC } from '@trpc/server';
import { crearUsuarioSchema, listaUsuariosQuerySchema } from '@tarea/contracts';
import type { UsuariosService } from '../usuarios/usuarios.service';

const t = initTRPC.create();

export function crearRouter(usuariosService: UsuariosService) {
  return t.router({
    usuario: t.router({
      list: t.procedure
        .input(listaUsuariosQuerySchema)
        .query(({ input }) => usuariosService.listar(input)),
      crear: t.procedure
        .input(crearUsuarioSchema)
        .mutation(({ input }) => usuariosService.crear(input)),
    }),
  });
}

export type AppRouter = ReturnType<typeof crearRouter>;
