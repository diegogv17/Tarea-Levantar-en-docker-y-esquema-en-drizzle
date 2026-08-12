import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { crearRouter } from './trpc.router';
import type { AppRouter } from './trpc.router';

@Injectable()
export class TrpcService {
  readonly appRouter: AppRouter;

  constructor(usuariosService: UsuariosService) {
    this.appRouter = crearRouter(usuariosService);
  }
}
