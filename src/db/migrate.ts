import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index';

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migraciones aplicadas correctamente');
}

main()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error('Error aplicando migraciones:', error);
    await pool.end();
    process.exit(1);
  });
