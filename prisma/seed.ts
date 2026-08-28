import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  image: string;
  order?: number;
};

type ProductSeed = {
  folder: string;
  name: string;
  sku: string;
  description: string;
  tags?: string[];
  attributes: Array<{ label: string; value: string }>;
  category: CategorySeed;
  subcategory?: CategorySeed;
};

type CategoryRecord = CategorySeed & {
  parentSlug: string | null;
  directProductCount: number;
  treeProductCount: number;
};

const catalog: ProductSeed[] = [
  {
    folder: 'Sofas',
    name: 'Sofas',
    sku: 'SUL-001',
    description: 'A classic sofa design with a comfortable upholstered build and a warm living-room style.',
    tags: ['sofa', 'living room'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Style', value: 'Classic living room sofa' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Sofas/1.png', order: 2 },
    subcategory: { name: 'Exclusive Sofas', slug: 'exclusive-sofas', description: 'Statement sofas with premium upholstery.', image: '/images/Sofas/1.png' },
  },
  {
    folder: 'Pooja_Rack',
    name: 'Pooja Rack',
    sku: 'SUL-002',
    description: 'A wooden pooja rack with a traditional silhouette suited to compact devotional corners.',
    tags: ['pooja rack', 'storage'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Traditional utility storage' },
    ],
    category: { name: 'Living Storage', slug: 'living-storage', description: 'Storage and display furniture for living areas.', image: '/images/Pooja_Rack/1.png', order: 6 },
    subcategory: { name: 'Pooja Rack', slug: 'pooja-rack', description: 'Decorative pooja units with refined detailing.', image: '/images/Pooja_Rack/1.png' },
  },
  {
    folder: 'Premium_Teak Wood_Sofa_Set',
    name: 'Premium Teak Wood Sofa Set',
    sku: 'SUL-003',
    description: 'A premium teak wood sofa set with a polished finish and a refined traditional style.',
    tags: ['teak wood sofa', 'sofa set'],
    attributes: [
      { label: 'Material', value: 'Teak wood' },
      { label: 'Style', value: 'Premium traditional sofa set' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Premium_Teak Wood_Sofa_Set/1.png', order: 2 },
    subcategory: { name: 'Teakwood Sofas', slug: 'teakwood-sofas', description: 'Durable teakwood sofas with a warm finish.', image: '/images/Premium_Teak Wood_Sofa_Set/1.png' },
  },
  {
    folder: 'Wooden_cot',
    name: 'Wooden Cot',
    sku: 'SUL-004',
    description: 'A sturdy wooden cot with a straightforward bedroom style and durable everyday construction.',
    tags: ['bed', 'wooden cot'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Solid wooden cot' },
    ],
    category: { name: 'Beds', slug: 'beds', description: 'Restful pieces designed for comfort and calm.', image: '/images/Wooden_cot/1.png', order: 3 },
    subcategory: { name: 'Wooden Beds', slug: 'wooden-beds', description: 'Timeless wooden beds finished in rich tones.', image: '/images/Wooden_cot/1.png' },
  },
  {
    folder: 'Dinning_table_4_seater',
    name: 'Dinning Table 4 Seater',
    sku: 'SUL-005',
    description: 'A four-seater dining table set with a practical layout and a clean wooden finish.',
    tags: ['dining', '4 seater'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Capacity', value: '4 seater' },
    ],
    category: { name: 'Dining', slug: 'dining', description: 'Dining essentials for family gatherings.', image: '/images/Dinning_table_4_seater/1.png', order: 4 },
    subcategory: { name: 'Rubberwood 4-Seater', slug: 'rubberwood-4-seater', description: 'Compact dining sets in warm rubberwood.', image: '/images/Dinning_table_4_seater/1.png' },
  },
  {
    folder: 'Teakwood_Pillar Model_King_Size Cot',
    name: 'Teakwood Pillar Model King Size Cot',
    sku: 'SUL-006',
    description: 'A teakwood king size cot with pillar detailing and a stately handcrafted bedroom look.',
    tags: ['king size bed', 'teakwood'],
    attributes: [
      { label: 'Material', value: 'Teakwood' },
      { label: 'Style', value: 'Pillar model king size cot' },
    ],
    category: { name: 'Beds', slug: 'beds', description: 'Restful pieces designed for comfort and calm.', image: '/images/Teakwood_Pillar Model_King_Size Cot/1.png', order: 3 },
    subcategory: { name: 'King-Size Beds', slug: 'king-size-beds', description: 'Grand beds with statement presence.', image: '/images/Teakwood_Pillar Model_King_Size Cot/1.png' },
  },
  {
    folder: 'wooden_king_sofa',
    name: 'Wooden King Sofa',
    sku: 'SUL-007',
    description: 'A wooden king sofa with bold arms, structured seating, and a rich carved furniture style.',
    tags: ['wooden sofa', 'living room'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'King sofa with carved detailing' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/wooden_king_sofa/1.png', order: 2 },
    subcategory: { name: 'Teakwood Sofas', slug: 'teakwood-sofas', description: 'Durable teakwood sofas with a warm finish.', image: '/images/wooden_king_sofa/1.png' },
  },
  {
    folder: 'wooden_traditional_swing',
    name: 'Wooden Traditional Swing',
    sku: 'SUL-008',
    description: 'A wooden traditional swing with a decorative silhouette made for a classic living-room setting.',
    tags: ['swing', 'living room'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Traditional indoor swing' },
    ],
    category: { name: 'Living Room', slug: 'living-room', description: 'Thoughtfully crafted living room furniture.', image: '/images/wooden_traditional_swing/1.png', order: 9 },
  },
  {
    folder: 'wooden_dressing_table',
    name: 'Wooden Dressing Table',
    sku: 'SUL-009',
    description: 'A wooden dressing table with a simple vanity format and a polished everyday bedroom style.',
    tags: ['dressing table', 'storage'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Classic dressing table' },
    ],
    category: { name: 'Living Storage', slug: 'living-storage', description: 'Storage and display furniture for living areas.', image: '/images/wooden_dressing_table/1.png', order: 6 },
    subcategory: { name: 'Dressing Tables', slug: 'dressing-tables', description: 'Elegant dressing tables for dressing areas.', image: '/images/wooden_dressing_table/1.png' },
  },
  {
    folder: 'Recliner_Leather Fabric_Sofa',
    name: 'Recliner Leather Fabric Sofa',
    sku: 'SUL-010',
    description: 'A recliner sofa with leather-fabric styling designed for deep seating comfort and relaxed lounging.',
    tags: ['recliner', 'sofa'],
    attributes: [
      { label: 'Material', value: 'Leather fabric upholstery' },
      { label: 'Style', value: 'Recliner lounge sofa' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Recliner_Leather Fabric_Sofa/1.png', order: 2 },
    subcategory: { name: 'Recliners', slug: 'recliners', description: 'Relaxed comfort with a reclined posture.', image: '/images/Recliner_Leather Fabric_Sofa/1.png' },
  },
  {
    folder: 'Wooden_Wardrobe',
    name: 'Wooden Wardrobe',
    sku: 'SUL-011',
    description: 'A wooden wardrobe with practical storage proportions and a straightforward bedroom finish.',
    tags: ['wardrobe', 'storage'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Bedroom storage wardrobe' },
    ],
    category: { name: 'Wardrobes', slug: 'wardrobes', description: 'Elegant storage wardrobes built for modern homes.', image: '/images/Wooden_Wardrobe/1.png', order: 1 },
  },
  {
    folder: 'Corner_Sofa',
    name: 'Corner Sofa',
    sku: 'SUL-012',
    description: 'A corner sofa shaped for lounge layouts with broad seating and a modern sectional profile.',
    tags: ['corner sofa', 'sectional'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Style', value: 'L-corner sofa' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Corner_Sofa/1.png', order: 2 },
    subcategory: { name: 'L-Corner Sofas', slug: 'l-corner-sofas', description: 'Modular lounge seating for larger rooms.', image: '/images/Corner_Sofa/1.png' },
  },
  {
    folder: 'Teakwood_Luxury_Sofa',
    name: 'Teakwood Luxury Sofa',
    sku: 'SUL-013',
    description: 'A teakwood luxury sofa with premium woodwork, formal styling, and a refined showcase finish.',
    tags: ['teakwood sofa', 'luxury sofa'],
    attributes: [
      { label: 'Material', value: 'Teakwood' },
      { label: 'Style', value: 'Luxury teakwood sofa' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Teakwood_Luxury_Sofa/1.png', order: 2 },
    subcategory: { name: 'Teakwood Sofas', slug: 'teakwood-sofas', description: 'Durable teakwood sofas with a warm finish.', image: '/images/Teakwood_Luxury_Sofa/1.png' },
  },
  {
    folder: '6_seater_dinning_table',
    name: '6 Seater Dinning Table',
    sku: 'SUL-014',
    description: 'A six-seater dining table set built for family meals with a roomy layout and wooden finish.',
    tags: ['dining', '6 seater'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Capacity', value: '6 seater' },
    ],
    category: { name: 'Dining', slug: 'dining', description: 'Dining essentials for family gatherings.', image: '/images/6_seater_dinning_table/1.png', order: 4 },
    subcategory: { name: 'Rubberwood 6-Seater', slug: 'rubberwood-6-seater', description: 'Practical dining sets for family meals.', image: '/images/6_seater_dinning_table/1.png' },
  },
  {
    folder: 'Jumbo_Sofa_3+1+1',
    name: 'Jumbo Sofa 3+1+1',
    sku: 'SUL-015',
    description: 'A jumbo 3+1+1 sofa set with broad seating proportions and a family-friendly lounge format.',
    tags: ['3+1+1 sofa', 'sofa set'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Style', value: '3+1+1 sofa set' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Jumbo_Sofa_3+1+1/1.png', order: 2 },
    subcategory: { name: '3+1+1 Sofas', slug: '3plus1plus1-sofas', description: 'Versatile lounge seating with modular charm.', image: '/images/Jumbo_Sofa_3+1+1/1.png' },
  },
  {
    folder: 'TV_Wall_Unit',
    name: 'TV Wall Unit',
    sku: 'SUL-016',
    description: 'A TV wall unit with storage-led design, display sections, and a clean entertainment-room style.',
    tags: ['tv unit', 'living storage'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Wall-mounted entertainment unit' },
    ],
    category: { name: 'Living Storage', slug: 'living-storage', description: 'Storage and display furniture for living areas.', image: '/images/TV_Wall_Unit/1.png', order: 6 },
    subcategory: { name: 'TV Unit', slug: 'tv-unit', description: 'Streamlined TV units for entertainment spaces.', image: '/images/TV_Wall_Unit/1.png' },
  },
  {
    folder: '3_seater_sofa',
    name: '3 Seater Sofa',
    sku: 'SUL-017',
    description: 'A compact three-seater sofa with a clean upholstered build and a comfortable everyday living-room style.',
    tags: ['sofa', '3 seater', 'living room'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Seating', value: '3 seater' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Sofas/1.png', order: 2 },
    subcategory: { name: '3+2 Sofas', slug: '3plus2-sofas', description: 'Classic 3-seater and 2-seater sofa sets.', image: '/images/3_seater_sofa/1.png' },
  },
  {
    folder: 'wooden_chair',
    name: 'Wooden Chair',
    sku: 'SUL-018',
    description: 'A solid wooden chair with a traditional form, sturdy joinery, and a timeless accent-seating style.',
    tags: ['chair', 'wooden', 'accent seating'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Traditional accent chair' },
    ],
    category: { name: 'Sofas', slug: 'sofas', description: 'Comfortable seating crafted with timeless detailing.', image: '/images/Sofas/1.png', order: 2 },
    subcategory: { name: 'Chairs', slug: 'chairs', description: 'Individual accent chairs for any seating corner.', image: '/images/wooden_chair/1.png' },
  },
  {
    folder: 'blue_diwan',
    name: 'Blue Diwan',
    sku: 'SUL-019',
    description: 'A vibrant blue upholstered diwan with a low-profile wooden frame — ideal for relaxed lounging and compact spaces.',
    tags: ['diwan', 'blue', 'lounge'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Colour', value: 'Blue' },
    ],
    category: { name: 'Diwans', slug: 'diwans', description: 'Low-seated diwans for relaxed traditional living.', image: '/images/blue_diwan/1.png', order: 7 },
  },
  {
    folder: 'yellow_diwan',
    name: 'Yellow Diwan',
    sku: 'SUL-020',
    description: 'A cheerful yellow upholstered diwan with a sturdy wooden base, bringing warmth and colour to any room.',
    tags: ['diwan', 'yellow', 'lounge'],
    attributes: [
      { label: 'Material', value: 'Wood frame with upholstered seating' },
      { label: 'Colour', value: 'Yellow' },
    ],
    category: { name: 'Diwans', slug: 'diwans', description: 'Low-seated diwans for relaxed traditional living.', image: '/images/blue_diwan/1.png', order: 7 },
  },
  {
    folder: 'wooden_swing2',
    name: 'Wooden Swing',
    sku: 'SUL-021',
    description: 'A beautifully carved wooden swing with decorative detailing — a classic statement piece for any living space.',
    tags: ['swing', 'wooden', 'living room'],
    attributes: [
      { label: 'Material', value: 'Wood' },
      { label: 'Style', value: 'Decorative indoor swing' },
    ],
    category: { name: 'Swings', slug: 'swings', description: 'Handcrafted wooden swings for traditional and contemporary homes.', image: '/images/wooden_swing2/1.png', order: 8 },
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildCategoryRecords() {
  const records = new Map<string, CategoryRecord>();

  const registerCategory = (category: CategorySeed, parentSlug: string | null, representativeImage: string) => {
    const existing = records.get(category.slug);

    if (existing) {
      return existing;
    }

    const created: CategoryRecord = {
      ...category,
      image: representativeImage,
      parentSlug,
      directProductCount: 0,
      treeProductCount: 0,
    };

    records.set(category.slug, created);
    return created;
  };

  for (const item of catalog) {
    const representativeImage = `/images/${item.folder}/1.png`;
    const topLevelCategory = registerCategory(item.category, null, representativeImage);
    const assignedCategory = item.subcategory
      ? registerCategory(item.subcategory, item.category.slug, representativeImage)
      : topLevelCategory;

    assignedCategory.directProductCount += 1;

    let current: CategoryRecord | undefined = assignedCategory;
    while (current) {
      current.treeProductCount += 1;

      if (!current.image) {
        current.image = representativeImage;
      }

      current = current.parentSlug ? records.get(current.parentSlug) : undefined;
    }
  }

  return records;
}

async function ensureCategory(prismaClient: PrismaClient | Prisma.TransactionClient, data: CategorySeed, parentId: string | null = null) {
  const existing = await prismaClient.category.findUnique({ where: { slug: data.slug } });

  if (existing) {
    return prismaClient.category.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        order: data.order ?? 0,
        parentId,
      },
    });
  }

  return prismaClient.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      order: data.order ?? 0,
      parentId,
    },
  });
}

async function ensureSiteSettings(prismaClient: PrismaClient | Prisma.TransactionClient) {
  const storyTitle = 'A Tradition of Quality. A Legacy of Trust.';
  const storyContent = 'For over 40 years, Sulochana Furniture has been part of countless homes, built on quality, honesty and trust. With our own manufacturing factory and carefully sourced teak and mahogany wood, we craft furniture designed to last for generations.';
  const address = '1A2, Udumalai Road, Chinnampalayam, Pollachi';
  const contactPhone = '+91 75503 50009';
  const contactEmail = 'sulochafurniture.superstore@gmail.com';
  const whatsappNumber = '917550350009';
  const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62736.145047295286!2d76.99011189213536!3d10.656403139824079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba837b4b87bae69%3A0xc458ac7e19f5f4a0!2sSulochana%20Furniture!5e0!3m2!1sen!2sus!4v1787731444451!5m2!1sen!2sus';

  return prismaClient.siteSetting.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      address,
      contactEmail,
      contactPhone,
      mapEmbedUrl,
      whatsappNumber,
      storyTitle,
      storyContent,
      storyImage: null,
      aboutBanner: null,
    },
    update: {
      address,
      contactEmail,
      contactPhone,
      mapEmbedUrl,
      whatsappNumber,
      storyTitle,
      storyContent,
    },
  });
}

async function ensureBanners(prismaClient: PrismaClient | Prisma.TransactionClient) {
  const bannerRows = [
    { image: '/images/slider/slider_2.jpg', title: null, subtitle: null, ctaLabel: null, ctaUrl: null, order: 1, active: true },
    { image: '/images/slider/slider_3.jpg', title: null, subtitle: null, ctaLabel: null, ctaUrl: null, order: 2, active: true },
    { image: '/images/slider/slider_4.jpg', title: null, subtitle: null, ctaLabel: null, ctaUrl: null, order: 3, active: true },
  ];

  await prismaClient.banner.deleteMany();

  return prismaClient.banner.createMany({
    data: bannerRows,
  });
}

async function ensureFooterLinks(prismaClient: PrismaClient | Prisma.TransactionClient) {
  const footerLinks = [
    { location: 'FOOTER', label: 'Home', url: '/', order: 1 },
    { location: 'FOOTER', label: 'About Us', url: '/about', order: 2 },
    { location: 'FOOTER', label: 'Categories', url: '/category/sofas', order: 3 },
    { location: 'FOOTER', label: 'Career', url: '/career', order: 4 },
    { location: 'FOOTER', label: 'Contact Us', url: '/contact', order: 5 },
  ] as const;

  await prismaClient.menuItem.deleteMany({ where: { location: 'FOOTER' } });

  return prismaClient.menuItem.createMany({
    data: footerLinks.map((item) => ({
      location: item.location,
      label: item.label,
      url: item.url,
      order: item.order,
    })),
  });
}

export async function seedDatabase(prismaClient: PrismaClient) {
  const categoryRecords = buildCategoryRecords();

  await ensureSiteSettings(prismaClient);
  await ensureBanners(prismaClient);
  await ensureFooterLinks(prismaClient);

  await prismaClient.productAttribute.deleteMany();
  await prismaClient.productImage.deleteMany();
  await prismaClient.product.deleteMany();

  const categoriesBySlug = new Map<string, { id: string; slug: string }>();
  const orderedCategories = Array.from(categoryRecords.values()).sort((left, right) => {
    if (left.parentSlug === right.parentSlug) {
      return (left.order ?? 0) - (right.order ?? 0) || left.name.localeCompare(right.name);
    }

    if (left.parentSlug === null) return -1;
    if (right.parentSlug === null) return 1;
    return left.name.localeCompare(right.name);
  });

  for (const categoryRecord of orderedCategories) {
    const parentId = categoryRecord.parentSlug ? categoriesBySlug.get(categoryRecord.parentSlug)?.id ?? null : null;
    const category = await ensureCategory(prismaClient, categoryRecord, parentId);
    categoriesBySlug.set(category.slug, { id: category.id, slug: category.slug });
  }

  for (const item of catalog) {
    const assignedCategorySlug = item.subcategory?.slug ?? item.category.slug;
    const assignedCategory = categoriesBySlug.get(assignedCategorySlug);

    if (!assignedCategory) {
      throw new Error(`Missing seeded category for product ${item.name}`);
    }

    const product = await prismaClient.product.create({
      data: {
        name: item.name,
        slug: slugify(item.name),
        sku: item.sku,
        description: item.description,
        brand: 'Sulochana',
        tags: item.tags?.join(', '),
        status: 'ACTIVE',
        categoryId: assignedCategory.id,
      },
    });

    await prismaClient.productImage.createMany({
      data: [1, 2, 3, 4].map((imageNumber, index) => ({
        productId: product.id,
        url: `/images/${item.folder}/${imageNumber}.png`,
        order: index,
      })),
    });

    if (item.attributes.length > 0) {
      await prismaClient.productAttribute.createMany({
        data: item.attributes.map((attribute) => ({
          productId: product.id,
          label: attribute.label,
          value: attribute.value,
        })),
      });
    }
  }

  const keepSlugs = new Set(categoryRecords.keys());
  const allCategories = await prismaClient.category.findMany({
    select: {
      id: true,
      slug: true,
      parentId: true,
    },
  });

  const staleCategories = allCategories.filter((category) => !keepSlugs.has(category.slug));

  if (staleCategories.length > 0) {
    const staleIds = staleCategories.map((category) => category.id);

    await prismaClient.menuItem.updateMany({
      where: { categoryId: { in: staleIds } },
      data: { categoryId: null },
    });

    const categoryById = new Map(allCategories.map((category) => [category.id, category]));
    const staleCategoriesWithDepth = staleCategories.map((category) => {
      let depth = 0;
      let currentParentId = category.parentId;

      while (currentParentId) {
        depth += 1;
        currentParentId = categoryById.get(currentParentId)?.parentId ?? null;
      }

      return { ...category, depth };
    });

    staleCategoriesWithDepth.sort((left, right) => right.depth - left.depth);

    for (const category of staleCategoriesWithDepth) {
      await prismaClient.category.delete({ where: { id: category.id } });
    }
  }

  console.log(`Seeded ${catalog.length} catalog products across ${Array.from(categoryRecords.values()).filter((category) => category.treeProductCount > 0).length} surviving categories.`);
}

async function main() {
  await seedDatabase(prisma);
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
