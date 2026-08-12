# Tarea — API REST + tRPC

API de usuarios construida con **NestJS**, **PostgreSQL + Drizzle ORM**, **tRPC**, **Zod** (contratos compartidos) y **Swagger** (OpenAPI).

## Stack

- **NestJS 11** — framework principal
- **PostgreSQL 17** — base de datos (Docker Compose)
- **Drizzle ORM** — migraciones, seed y acceso a datos
- **tRPC** — API tipada (`/trpc`) expuesta como middleware Express
- **Zod** — contratos y validación compartidos (`packages/contracts`)
- **@nestjs/swagger** — documentación en `/docs` y export `openapi.json`

## Requisitos

- Node.js 20+
- pnpm
- Docker (para PostgreSQL)

## Puesta en marcha

### 1. Base de datos

Levanta PostgreSQL con Docker (usa variables de `.env`, por defecto puerto `5433`):

```bash
docker compose up -d
```

### 2. Variables de entorno

Copia `.env` desde `.env.example` (o crea el tuyo). Variables usadas:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5433/tarea
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tarea
PORT=3000
```

### 3. Instalación

```bash
pnpm install
```

### 4. Migraciones y seed

```bash
pnpm db:generate   # genera SQL de migración desde src/db/schema.ts (drizzle/)
pnpm db:migrate    # aplica migraciones
pnpm db:seed       # inserta 5 usuarios de ejemplo
```

## Ejecución

```bash
pnpm start         # compilado
pnpm start:dev     # watch mode
pnpm start:prod    # producción (dist)
```

## Endpoints REST (`/usuarios`)

| Método | Ruta          | Descripción                        | Códigos                               |
| ------ | ------------- | ---------------------------------- | ------------------------------------- |
| GET    | `/usuarios`   | Lista paginada de usuarios         | `200`, `400`                          |
| GET    | `/usuarios/:id` | Obtiene un usuario por id        | `200`, `400`, `404`                   |
| POST   | `/usuarios`   | Crea un usuario                    | `201`, `400`, `409`                   |
| PATCH  | `/usuarios/:id` | Actualiza un usuario parcialmente| `200`, `400`, `404`, `409`            |
| DELETE | `/usuarios/:id` | Elimina un usuario               | `200`, `400`, `404`                   |

### Paginación

`GET /usuarios?page=1&limit=10` — `page` empieza en 1, `limit` máximo 100. Respuesta:

```json
{
  "data": [
    {
      "id": 5,
      "nombre": "Sofía Torres",
      "email": "sofia.torres@example.com",
      "activo": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Cuerpo de `POST /usuarios`

```json
{
  "nombre": "Diego López",
  "email": "diego.lopez@example.com",
  "password": "secret123",
  "activo": true
}
```

- `nombre`: 1–100 caracteres (obligatorio)
- `email`: formato válido, máximo 255 (obligatorio, único)
- `password`: mínimo 8 caracteres (obligatorio)
- `activo`: booleano (opcional, por defecto `true`)

`PATCH /usuarios/:id` acepta el mismo cuerpo pero todos los campos opcionales (parcial).

### Validación y errores

La validación se realiza con el `ZodPipe` (`src/common/pipes/zod.pipe.ts`) usando los
esquemas de `@tarea/contracts`. Campos inválidos devuelven `400` con la estructura
de errores por campo:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    { "path": "email", "message": "El email no es válido", "code": "invalid_string" },
    { "path": "password", "message": "La contraseña debe tener al menos 8 caracteres", "code": "too_small" }
  ]
}
```

Email duplicado devuelve `409 Conflict`; usuario inexistente devuelve `404 Not Found`.
La contraseña nunca se devuelve en las respuestas.

## tRPC (`/trpc`)

| Procedimiento             | Tipo      | Entrada                                | Salida           |
| ------------------------- | --------- | -------------------------------------- | ---------------- |
| `usuario.list`            | query     | `{ page, limit }`                      | `PaginaUsuarios` |
| `usuario.crear`           | mutation  | `crearUsuarioSchema`                   | `Usuario`        |

Ejemplo de llamada HTTP (JSON-RPC de tRPC):

```bash
curl -X POST http://localhost:3000/trpc/usuario.list?input='{"page":1,"limit":10}'
curl -X POST http://localhost:3000/trpc/usuario.crear \
  -H 'content-type: application/json' \
  -d '{"nombre":"Ana","email":"ana@example.com","password":"secret123"}'
```

## Swagger / OpenAPI

- Interfaz interactiva: <http://localhost:3000/docs>
- Especificación OpenAPI exportada en `openapi.json` (se regenera en cada arranque).

## Estructura del proyecto

```
src/
  common/pipes/zod.pipe.ts    # Pipe de validación Zod -> 400
  db/                         # Conexión, schema, migraciones, seed
  trpc/                       # Router tRPC (usuario.list, usuario.crear)
  usuarios/                   # Controller REST, service y repository
  main.ts                     # Bootstrap + Swagger + tRPC + openapi.json
packages/
  contracts/                  # Esquemas Zod y tipos compartidos
    src/
      usuario.ts              # usuario/crear/actualizar/id
      paginacion.ts           # query, meta y página
      errores.ts              # errores de validación
drizzle/                      # migraciones SQL generadas
```

## Scripts

```bash
pnpm build           # compila a dist
pnpm lint            # eslint (autofix)
pnpm test            # unit tests (jest)
pnpm test:e2e        # e2e tests (supertest)
pnpm test:cov        # cobertura
pnpm format          # prettier
pnpm db:generate     # genera migraciones Drizzle
pnpm db:migrate      # aplica migraciones
pnpm db:seed         # datos de ejemplo
```
