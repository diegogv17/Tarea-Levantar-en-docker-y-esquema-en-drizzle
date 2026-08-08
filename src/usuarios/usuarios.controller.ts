import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { NuevoUsuario, Usuario } from '../db/schema';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.findById(id);
  }

  @Post()
  create(@Body() data: NuevoUsuario): Promise<Usuario> {
    return this.usuariosService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<NuevoUsuario>,
  ): Promise<Usuario> {
    return this.usuariosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.remove(id);
  }
}
