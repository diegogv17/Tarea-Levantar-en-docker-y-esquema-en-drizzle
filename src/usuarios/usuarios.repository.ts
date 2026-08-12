import { Inject, Injectable } from '@nestjs/common';
import { desc, eq, ilike, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../db/db.module';
import type * as schema from '../db/schema';
import { NuevoUsuario, Usuario, usuarios } from '../db/schema';

export type DbClient = NodePgDatabase<typeof schema>;

export interface PaginaDb {
  data: Usuario[];
  total: number;
}

@Injectable()
export class UsuariosRepository {
  constructor(@Inject(DB) private readonly db: DbClient) {}

  async findAllPaginado(page: number, limit: number): Promise<PaginaDb> {
    const [data, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(usuarios)
        .orderBy(desc(usuarios.id))
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ count: sql<number>`count(*)` }).from(usuarios),
    ]);
    return { data, total: Number(count) };
  }

  findById(id: number): Promise<Usuario | undefined> {
    return this.db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    });
  }

  findByEmail(email: string): Promise<Usuario | undefined> {
    return this.db.query.usuarios.findFirst({
      where: ilike(usuarios.email, email),
    });
  }

  create(data: NuevoUsuario): Promise<Usuario[]> {
    return this.db.insert(usuarios).values(data).returning();
  }

  update(id: number, data: Partial<NuevoUsuario>): Promise<Usuario[]> {
    return this.db
      .update(usuarios)
      .set(data)
      .where(eq(usuarios.id, id))
      .returning();
  }

  remove(id: number): Promise<Usuario[]> {
    return this.db.delete(usuarios).where(eq(usuarios.id, id)).returning();
  }
}
