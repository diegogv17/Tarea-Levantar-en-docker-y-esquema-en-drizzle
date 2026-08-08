import { Injectable, NotFoundException } from '@nestjs/common';
import { NuevoUsuario, Usuario } from '../db/schema';
import { UsuariosRepository } from './usuarios.repository';

@Injectable()
export class UsuariosService {
  constructor(private readonly repository: UsuariosRepository) {}

  findAll(): Promise<Usuario[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async create(data: NuevoUsuario): Promise<Usuario> {
    const [usuario] = await this.repository.create(data);
    return usuario;
  }

  async update(id: number, data: Partial<NuevoUsuario>): Promise<Usuario> {
    await this.findById(id);
    const [usuario] = await this.repository.update(id, data);
    return usuario;
  }

  async remove(id: number): Promise<Usuario> {
    const [usuario] = await this.repository.remove(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }
}
