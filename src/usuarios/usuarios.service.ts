import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  ActualizarUsuarioInput,
  CrearUsuarioInput,
  ListaUsuariosQuery,
  PaginaUsuarios,
  Usuario,
} from '@tarea/contracts';
import type { Usuario as DbUsuario } from '../db/schema';
import { UsuariosRepository } from './usuarios.repository';

@Injectable()
export class UsuariosService {
  constructor(private readonly repository: UsuariosRepository) {}

  async listar(query: ListaUsuariosQuery): Promise<PaginaUsuarios> {
    const { page, limit } = query;
    const { data, total } = await this.repository.findAllPaginado(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((usuario) => this.omitirPassword(usuario)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.omitirPassword(usuario);
  }

  async crear(data: CrearUsuarioInput): Promise<Usuario> {
    const existente = await this.repository.findByEmail(data.email);
    if (existente) {
      throw new ConflictException(
        `Ya existe un usuario con el email ${data.email}`,
      );
    }
    const [usuario] = await this.repository.create({
      ...data,
      activo: data.activo ?? true,
    });
    return this.omitirPassword(usuario);
  }

  async actualizar(id: number, data: ActualizarUsuarioInput): Promise<Usuario> {
    await this.obtenerPorId(id);
    if (data.email !== undefined) {
      const existente = await this.repository.findByEmail(data.email);
      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Ya existe un usuario con el email ${data.email}`,
        );
      }
    }
    const [usuario] = await this.repository.update(id, data);
    return this.omitirPassword(usuario);
  }

  async eliminar(id: number): Promise<Usuario> {
    const [usuario] = await this.repository.remove(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.omitirPassword(usuario);
  }

  private omitirPassword(usuario: DbUsuario): Usuario {
    const { password, ...resto } = usuario;
    void password;
    return resto;
  }
}
