import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './seed';

const prisma = new PrismaClient();

function getDatabaseHost(databaseUrl: string | undefined): string {
  if (!databaseUrl) {
    return 'unknown host';
  }
  try {
    return new URL(databaseUrl).host;
  } catch {
    return 'unknown host';
  }
}

async function main() {
  const host = getDatabaseHost(process.env.DATABASE_URL);
  console.log(`About to wipe and reseed the database at: ${host}`);

  if (process.env.ALLOW_DB_RESET !== 'true') {
    console.error(
      'Refusing to run: set ALLOW_DB_RESET=true as an environment variable to confirm you want to reset this database.',
    );
    process.exit(1);
  }

  console.log('Resetting database...');

  await seedDatabase(prisma);

  console.log('Database reset and reseeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
