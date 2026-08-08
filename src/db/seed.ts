import { db, pool } from './index';
import { usuarios } from './schema';

async function seed() {
  const data = [
    {
      nombre: 'Ana García',
      email: 'ana.garcia@example.com',
      password: 'password123',
    },
    {
      nombre: 'Luis Pérez',
      email: 'luis.perez@example.com',
      password: 'password456',
    },
    {
      nombre: 'María López',
      email: 'maria.lopez@example.com',
      password: 'password789',
    },
    {
      nombre: 'Carlos Ruiz',
      email: 'carlos.ruiz@example.com',
      password: 'passwordabc',
    },
    {
      nombre: 'Sofía Torres',
      email: 'sofia.torres@example.com',
      password: 'passworddef',
    },
  ];

  const result = await db
    .insert(usuarios)
    .values(data)
    .onConflictDoNothing()
    .returning();

  console.log(`Seed completado: ${result.length} usuarios insertados`);
}

seed()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error('Error en el seed:', error);
    await pool.end();
    process.exit(1);
  });
