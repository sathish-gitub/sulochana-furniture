import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './seed';

const prisma = new PrismaClient();

async function main() {
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
