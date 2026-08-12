import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  actualizarUsuarioSchema,
  crearUsuarioSchema,
  listaUsuariosQuerySchema,
  usuarioIdSchema,
} from '@tarea/contracts';
import type {
  ActualizarUsuarioInput,
  CrearUsuarioInput,
  ListaUsuariosQuery,
  PaginaUsuarios,
  Usuario,
} from '@tarea/contracts';
import { ZodPipe } from '../common/pipes/zod.pipe';
import { UsuariosService } from './usuarios.service';

const bodyUsuario = {
  type: 'object',
  required: ['nombre', 'email', 'password'],
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', minLength: 8, maxLength: 255 },
    activo: { type: 'boolean' },
  },
};

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios paginados' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
    description: 'Número de página (empieza en 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    description: 'Cantidad de elementos por página (máx. 100)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista paginada de usuarios',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Query inválida',
  })
  listar(
    @Query(new ZodPipe(listaUsuariosQuerySchema)) query: ListaUsuariosQuery,
  ): Promise<PaginaUsuarios> {
    return this.usuariosService.listar(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiParam({ name: 'id', schema: { type: 'integer', minimum: 1 } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Id inválido' })
  obtenerPorId(
    @Param('id', new ZodPipe(usuarioIdSchema)) id: number,
  ): Promise<Usuario> {
    return this.usuariosService.obtenerPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiBody({ schema: bodyUsuario })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Campos inválidos',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email duplicado' })
  crear(
    @Body(new ZodPipe(crearUsuarioSchema)) data: CrearUsuarioInput,
  ): Promise<Usuario> {
    return this.usuariosService.crear(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', schema: { type: 'integer', minimum: 1 } })
  @ApiBody({ schema: bodyUsuario })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Campos inválidos',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email duplicado' })
  actualizar(
    @Param('id', new ZodPipe(usuarioIdSchema)) id: number,
    @Body(new ZodPipe(actualizarUsuarioSchema)) data: ActualizarUsuarioInput,
  ): Promise<Usuario> {
    return this.usuariosService.actualizar(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', schema: { type: 'integer', minimum: 1 } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Id inválido' })
  eliminar(
    @Param('id', new ZodPipe(usuarioIdSchema)) id: number,
  ): Promise<Usuario> {
    return this.usuariosService.eliminar(id);
  }
}
