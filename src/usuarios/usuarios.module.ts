import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosRepository } from './usuarios.repository';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [DbModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosRepository],
})
export class UsuariosModule {}
