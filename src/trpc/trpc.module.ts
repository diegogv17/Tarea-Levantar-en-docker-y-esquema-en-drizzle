import { Module } from '@nestjs/common';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TrpcService } from './trpc.service';

@Module({
  imports: [UsuariosModule],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
