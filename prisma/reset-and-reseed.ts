import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting database...');

  await prisma.$transaction(async (tx) => {
    await tx.productAttribute.deleteMany();
    await tx.productImage.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.banner.deleteMany();
    await tx.testimonial.deleteMany();
    await tx.menuItem.deleteMany();
  });

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
