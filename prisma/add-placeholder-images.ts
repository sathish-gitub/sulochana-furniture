import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryPlaceholderImages = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
];

const productPlaceholderImages = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
];

async function main() {
  const categoriesToUpdate = await prisma.category.findMany({
    where: { OR: [{ image: null }, { image: '' }] },
  });

  let updatedCategories = 0;
  for (const category of categoriesToUpdate) {
    const image = categoryPlaceholderImages[updatedCategories % categoryPlaceholderImages.length];
    await prisma.category.update({
      where: { id: category.id },
      data: { image },
    });
    updatedCategories += 1;
  }

  const productsToUpdate = await prisma.product.findMany({
    where: { images: { none: {} } },
  });

  let updatedProducts = 0;
  for (const product of productsToUpdate) {
    const image = productPlaceholderImages[updatedProducts % productPlaceholderImages.length];
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: image,
        order: 1,
      },
    });
    updatedProducts += 1;
  }

  console.log(`Updated ${updatedCategories} categories and ${updatedProducts} products with placeholder images.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
