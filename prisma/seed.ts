import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categoryDefinitions = [
  {
    name: 'Wardrobes',
    slug: 'wardrobes',
    description: 'Elegant storage wardrobes built for modern homes.',
    image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=1400&q=80',
    order: 1,
    subcategories: [
      { name: '2-Door Wardrobes', slug: '2-door-wardrobes', description: 'Compact wardrobes with refined finishes.' },
      { name: '3-Door Wardrobes', slug: '3-door-wardrobes', description: 'Spacious wardrobes for everyday storage.' },
      { name: '4-Door Wardrobes', slug: '4-door-wardrobes', description: 'Grand wardrobes for large bedrooms.' },
    ],
  },
  {
    name: 'Sofas',
    slug: 'sofas',
    description: 'Comfortable seating crafted with timeless detailing.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
    order: 2,
    subcategories: [
      { name: 'Exclusive Sofas', slug: 'exclusive-sofas', description: 'Statement sofas with premium upholstery.' },
      { name: 'L-Corner Sofas', slug: 'l-corner-sofas', description: 'Modular lounge seating for larger rooms.' },
      { name: 'Recliners', slug: 'recliners', description: 'Relaxed comfort with a reclined posture.' },
      { name: 'Sofa Cum Beds', slug: 'sofa-cum-beds', description: 'Multi-use sofas for guest comfort.' },
      { name: '3+1+1 Sofas', slug: '3plus1plus1-sofas', description: 'Versatile lounge seating with modular charm.' },
      { name: '3+2 Sofas', slug: '3plus2-sofas', description: 'Spacious sofas for family living.' },
      { name: 'Teakwood Sofas', slug: 'teakwood-sofas', description: 'Durable teakwood sofas with a warm finish.' },
      { name: 'Teakwood Headrest 3+1+1 Sofas', slug: 'teakwood-headrest-3plus1plus1-sofas', description: 'Premium teakwood sofas with headrest comfort.' },
    ],
  },
  {
    name: 'Beds',
    slug: 'beds',
    description: 'Restful pieces designed for comfort and calm.',
    image: 'https://images.unsplash.com/photo-1688383454669-9f5cc5991778?auto=format&fit=crop&w=1400&q=80',
    order: 3,
    subcategories: [
      { name: 'Double Beds', slug: 'double-beds', description: 'Classic double beds for balanced bedroom styling.' },
      { name: 'King-Size Beds', slug: 'king-size-beds', description: 'Grand beds with statement presence.' },
      { name: 'Queen-Size Beds', slug: 'queen-size-beds', description: 'Elegant queen beds with premium detailing.' },
      { name: 'Single Beds', slug: 'single-beds', description: 'Compact beds for children and guest rooms.' },
      { name: 'Wooden Beds', slug: 'wooden-beds', description: 'Timeless wooden beds finished in rich tones.' },
    ],
  },
  {
    name: 'Dining',
    slug: 'dining',
    description: 'Dining essentials for family gatherings.',
    image: 'https://images.unsplash.com/photo-1758977404499-32e2cae3c846?auto=format&fit=crop&w=1400&q=80',
    order: 4,
    subcategories: [
      { name: 'Rubberwood 4-Seater', slug: 'rubberwood-4-seater', description: 'Compact dining sets in warm rubberwood.' },
      { name: 'Rubberwood 6-Seater', slug: 'rubberwood-6-seater', description: 'Practical dining sets for family meals.' },
      { name: 'Teakwood 4-Seater', slug: 'teakwood-4-seater', description: 'Refined teakwood dining tables for intimate spaces.' },
      { name: 'Teakwood 6-Seater', slug: 'teakwood-6-seater', description: 'Durable teakwood dining sets for large gatherings.' },
    ],
  },
  {
    name: 'Office Furniture',
    slug: 'office-furniture',
    description: 'Functional office solutions with executive style.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
    order: 5,
    subcategories: [
      { name: 'Bookshelf', slug: 'office-bookshelf', description: 'Storage shelving for workspaces.' },
      { name: 'MD Chair', slug: 'md-chair', description: 'Executive seating for modern offices.' },
      { name: 'MD Table', slug: 'md-table', description: 'Executive desks with premium finishes.' },
      { name: 'Office Chairs', slug: 'office-chairs', description: 'Ergonomic chairs for long working hours.' },
      { name: 'Office Tables', slug: 'office-tables', description: 'Practical tables for professional workspaces.' },
      { name: 'Reception Table', slug: 'reception-table', description: 'Elegant front-desk furniture for offices.' },
      { name: 'Study Table', slug: 'study-table', description: 'Compact study tables designed for focus.' },
      { name: 'Visitor Chairs', slug: 'visitor-chairs', description: 'Comfortable seating for client-facing spaces.' },
    ],
  },
  {
    name: 'Living Storage',
    slug: 'living-storage',
    description: 'Storage and display furniture for living areas.',
    image: 'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?auto=format&fit=crop&w=1400&q=80',
    order: 6,
    subcategories: [
      { name: 'Bookshelf', slug: 'bookshelf', description: 'Stylish shelving for books and decor.' },
      { name: 'Coffee Table', slug: 'coffee-table', description: 'Functional coffee tables for lounge spaces.' },
      { name: 'Dressing Tables', slug: 'dressing-tables', description: 'Elegant dressing tables for dressing areas.' },
      { name: 'Pooja Rack', slug: 'pooja-rack', description: 'Decorative pooja units with refined detailing.' },
      { name: 'Shoe Racks', slug: 'shoe-racks', description: 'Organized shoe storage for entryways.' },
      { name: 'TV Unit', slug: 'tv-unit', description: 'Streamlined TV units for entertainment spaces.' },
    ],
  },
  {
    name: 'Furniture Packages',
    slug: 'furniture-packages',
    description: 'Curated bundles for complete room transformations.',
    image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=1400&q=80',
    order: 7,
    subcategories: [
      { name: 'Combo Offer 1', slug: 'combo-offer-1', description: 'A complete bedroom or living room set.' },
      { name: 'Combo Offer 2', slug: 'combo-offer-2', description: 'A coordinated lounge and storage package.' },
      { name: 'Combo Offer 3', slug: 'combo-offer-3', description: 'A dining and storage package for modern homes.' },
      { name: 'Combo Offer 4', slug: 'combo-offer-4', description: 'A worked-on package with statement pieces.' },
    ],
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Freshly introduced collections for contemporary homes.',
    image: 'https://images.unsplash.com/photo-1782512175859-02bde5592785?auto=format&fit=crop&w=1400&q=80',
    order: 8,
    subcategories: [],
  },
  {
    name: 'Living Room',
    slug: 'living-room',
    description: 'Thoughtfully crafted living room furniture.',
    image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=1400&q=80',
    order: 9,
    subcategories: [
      { name: 'Centre Tables', slug: 'centre-tables', description: 'Elegant center tables that complete the lounge.' },
      { name: 'Console Tables', slug: 'console-tables', description: 'Slim tables for foyer and living spaces.' },
    ],
  },
  {
    name: 'Kitchen Tables',
    slug: 'kitchen-tables',
    description: 'Practical and polished tables for the heart of the home.',
    image: 'https://images.unsplash.com/photo-1758977404712-5d5165c66e4a?auto=format&fit=crop&w=1400&q=80',
    order: 10,
    subcategories: [],
  },
];

const productDefinitions = [
  { name: 'Aurelia 2-Door Wardrobe', slug: 'aurelia-2-door-wardrobe', sku: 'WRD-001', description: 'A refined two-door wardrobe with smooth walnut finish and soft-close doors.', categorySlug: 'wardrobes', image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Engineered Wood' }, { label: 'Finish', value: 'Walnut' }] },
  { name: 'Nova 3-Door Wardrobe', slug: 'nova-3-door-wardrobe', sku: 'WRD-002', description: 'A spacious three-door wardrobe with hanging and shelved storage.', categorySlug: 'wardrobes', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Wood' }, { label: 'Finish', value: 'Oak' }] },
  { name: 'Lumen 4-Door Wardrobe', slug: 'lumen-4-door-wardrobe', sku: 'WRD-003', description: 'A statement four-door wardrobe designed for generous storage.', categorySlug: 'wardrobes', image: 'https://images.unsplash.com/photo-1605116959031-6e2d13a2ee56?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'MDF + Veneer' }, { label: 'Finish', value: 'Teak' }] },
  { name: 'Eden Exclusive Sofa', slug: 'eden-exclusive-sofa', sku: 'SOF-001', description: 'An inviting exclusive sofa with plush seating and sculpted arms.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Fabric + Foam' }, { label: 'Seating', value: '3-Seater' }] },
  { name: 'Orchid L-Corner Sofa', slug: 'orchid-l-corner-sofa', sku: 'SOF-002', description: 'A modular L-corner sofa for relaxed living room corners.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1759722665629-29df6ee4f9a5?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Chenille' }, { label: 'Seating', value: '5-Seater' }] },
  { name: 'Harbor Recliner', slug: 'harbor-recliner', sku: 'SOF-003', description: 'A plush recliner that brings lounge comfort to the living room.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1782512175859-02bde5592785?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Leatherette' }, { label: 'Mechanism', value: 'Manual Recline' }] },
  { name: 'Marlow Sofa Cum Bed', slug: 'marlow-sofa-cum-bed', sku: 'SOF-004', description: 'A compact sofa cum bed ideal for guest rooms and studios.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1634497885778-152eb6fd543d?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Fabric + Wood' }, { label: 'Function', value: 'Bed + Sofa' }] },
  { name: 'Velora 3+1+1 Sofa', slug: 'velora-3plus1plus1-sofa', sku: 'SOF-005', description: 'A balanced three-seater sofa with a modular look.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Premium Fabric' }, { label: 'Layout', value: '3+1+1' }] },
  { name: 'Crest 3+2 Sofa', slug: 'crest-3plus2-sofa', sku: 'SOF-006', description: 'A handsome 3+2 sofa with generous lounge space.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1696778382637-21ec8b69a149?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Boucle' }, { label: 'Layout', value: '3+2' }] },
  { name: 'Grove Teakwood Sofa', slug: 'grove-teakwood-sofa', sku: 'SOF-007', description: 'A sturdy teakwood sofa finished in a warm natural tone.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Teakwood' }, { label: 'Finish', value: 'Natural' }] },
  { name: 'Astra Headrest Sofa', slug: 'astra-headrest-sofa', sku: 'SOF-008', description: 'A headrest-rich teakwood sofa designed for lounge comfort.', categorySlug: 'sofas', image: 'https://images.unsplash.com/photo-1782512175859-02bde5592785?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Teakwood + Fabric' }, { label: 'Comfort', value: 'Headrest' }] },
  { name: 'Arden Double Bed', slug: 'arden-double-bed', sku: 'BED-001', description: 'A timeless double bed with premium upholstered detail.', categorySlug: 'beds', image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Wood' }, { label: 'Size', value: 'Double' }] },
  { name: 'Royal King Bed', slug: 'royal-king-bed', sku: 'BED-002', description: 'A grand king-size bed with a plush upholstered headboard.', categorySlug: 'beds', image: 'https://images.unsplash.com/photo-1688383454669-9f5cc5991778?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Ash Wood + Velvet' }, { label: 'Size', value: 'King' }] },
  { name: 'Sage Queen Bed', slug: 'sage-queen-bed', sku: 'BED-003', description: 'A refined queen bed that complements contemporary bedrooms.', categorySlug: 'beds', image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Wood' }, { label: 'Size', value: 'Queen' }] },
  { name: 'Luna Single Bed', slug: 'luna-single-bed', sku: 'BED-004', description: 'A compact single bed that makes the most of smaller rooms.', categorySlug: 'beds', image: 'https://images.unsplash.com/photo-1688383454669-9f5cc5991778?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Sheesham Wood' }, { label: 'Size', value: 'Single' }] },
  { name: 'Cedar Wooden Bed', slug: 'cedar-wooden-bed', sku: 'BED-005', description: 'A solid wooden bed with a graceful silhouette and organic finish.', categorySlug: 'beds', image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Teak' }, { label: 'Finish', value: 'Honey' }] },
  { name: 'Mira Dining Set', slug: 'mira-dining-set', sku: 'DIN-001', description: 'A compact rubberwood dining set suited to intimate breakfast spaces.', categorySlug: 'dining', image: 'https://images.unsplash.com/photo-1758977405163-f2595de08dfe?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Rubberwood' }, { label: 'Capacity', value: '4-Seater' }] },
  { name: 'Nera 6-Seater Dining', slug: 'nera-6-seater-dining', sku: 'DIN-002', description: 'A sturdy six-seater dining set for everyday family meals.', categorySlug: 'dining', image: 'https://images.unsplash.com/photo-1758977403616-056095cfb6c1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Rubberwood' }, { label: 'Capacity', value: '6-Seater' }] },
  { name: 'Tara Teak 4-Seater', slug: 'tara-teak-4-seater', sku: 'DIN-003', description: 'A refined teakwood four-seater dining table with matching chairs.', categorySlug: 'dining', image: 'https://images.unsplash.com/photo-1758977404712-5d5165c66e4a?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Teakwood' }, { label: 'Capacity', value: '4-Seater' }] },
  { name: 'Ari Teak 6-Seater', slug: 'ari-teak-6-seater', sku: 'DIN-004', description: 'A stately six-seater teakwood dining set for larger homes.', categorySlug: 'dining', image: 'https://images.unsplash.com/photo-1758977403861-7dfacf1fc55f?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Teakwood' }, { label: 'Capacity', value: '6-Seater' }] },
  { name: 'Atelier Office Chair', slug: 'atelier-office-chair', sku: 'OFF-001', description: 'A sleek ergonomic office chair for modern workstations.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Mesh + Nylon' }, { label: 'Use', value: 'Ergonomic' }] },
  { name: 'Basil MD Chair', slug: 'basil-md-chair', sku: 'OFF-002', description: 'A premium executive chair with sculpted support and elegance.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Leatherette' }, { label: 'Use', value: 'Executive' }] },
  { name: 'Frame MD Table', slug: 'frame-md-table', sku: 'OFF-003', description: 'A bold executive table for professional workspaces.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Engineered Wood' }, { label: 'Use', value: 'Executive' }] },
  { name: 'Meridian Study Table', slug: 'meridian-study-table', sku: 'OFF-004', description: 'A compact study table with a clean and balanced form.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'MDF' }, { label: 'Use', value: 'Study' }] },
  { name: 'Monarch Reception Table', slug: 'monarch-reception-table', sku: 'OFF-005', description: 'An elegant reception table for welcoming clients and guests.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Wood + Glass' }, { label: 'Use', value: 'Reception' }] },
  { name: 'Horizon Visitor Chair', slug: 'horizon-visitor-chair', sku: 'OFF-006', description: 'A comfortable visitor chair designed for hospitality and business settings.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Fabric' }, { label: 'Use', value: 'Visitor' }] },
  { name: 'Lumen Bookshelf', slug: 'lumen-bookshelf', sku: 'OFF-007', description: 'A slim and practical bookshelf for the office.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1655760711665-e77aef000c4b?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Engineered Wood' }, { label: 'Use', value: 'Storage' }] },
  { name: 'Coda Office Table', slug: 'coda-office-table', sku: 'OFF-008', description: 'A versatile office table suited to collaborative work.', categorySlug: 'office-furniture', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'MDF' }, { label: 'Use', value: 'Office' }] },
  { name: 'Nori Bookshelf', slug: 'nori-bookshelf', sku: 'STO-001', description: 'A refined bookshelf for living room storage and display.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Wood' }, { label: 'Use', value: 'Display' }] },
  { name: 'Aven Coffee Table', slug: 'aven-coffee-table', sku: 'STO-002', description: 'A sculptural coffee table finished in warm walnut.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Wood' }, { label: 'Shape', value: 'Rectangular' }] },
  { name: 'Daria Dressing Table', slug: 'daria-dressing-table', sku: 'STO-003', description: 'A graceful dressing table with soft curves and storage.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1605116959031-6e2d13a2ee56?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Wood' }, { label: 'Use', value: 'Dressing' }] },
  { name: 'Sona Pooja Rack', slug: 'sona-pooja-rack', sku: 'STO-004', description: 'A refined pooja rack with neat shelving and carved detailing.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Teakwood' }, { label: 'Use', value: 'Pooja' }] },
  { name: 'Mira Shoe Rack', slug: 'mira-shoe-rack', sku: 'STO-005', description: 'A sleek shoe rack with multiple compartments for everyday use.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1605116959031-6e2d13a2ee56?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Engineered Wood' }, { label: 'Use', value: 'Storage' }] },
  { name: 'Vega TV Unit', slug: 'vega-tv-unit', sku: 'STO-006', description: 'A clean-lined TV unit with concealed storage and display shelves.', categorySlug: 'living-storage', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Veneer' }, { label: 'Use', value: 'Entertainment' }] },
  { name: 'Auri Combo Offer 1', slug: 'auri-combo-offer-1', sku: 'PKG-001', description: 'A curated package featuring a sofa, center table, and storage unit.', categorySlug: 'furniture-packages', image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Package', value: 'Living Room Bundle' }] },
  { name: 'Mina Combo Offer 2', slug: 'mina-combo-offer-2', sku: 'PKG-002', description: 'A complete living room package with storage and lounge pieces.', categorySlug: 'furniture-packages', image: 'https://images.unsplash.com/photo-1759722665629-29df6ee4f9a5?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Package', value: 'Lounge Bundle' }] },
  { name: 'Sage Combo Offer 3', slug: 'sage-combo-offer-3', sku: 'PKG-003', description: 'A dining and storage package for a polished home setup.', categorySlug: 'furniture-packages', image: 'https://images.unsplash.com/photo-1758977403861-7dfacf1fc55f?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Package', value: 'Dining Bundle' }] },
  { name: 'Nova Combo Offer 4', slug: 'nova-combo-offer-4', sku: 'PKG-004', description: 'A flexible package with statement pieces for bedrooms and living spaces.', categorySlug: 'furniture-packages', image: 'https://images.unsplash.com/photo-1517912158475-fb0ab8c8eed1?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Package', value: 'Signature Bundle' }] },
  { name: 'Crest Centre Table', slug: 'crest-centre-table', sku: 'LIV-001', description: 'A striking centre table that anchors the living room.', categorySlug: 'living-room', image: 'https://images.unsplash.com/photo-1759722668125-9b05341020c8?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Wood' }, { label: 'Shape', value: 'Round' }] },
  { name: 'Briar Console Table', slug: 'briar-console-table', sku: 'LIV-002', description: 'A slim console table that brings balance to entry and living spaces.', categorySlug: 'living-room', image: 'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Wood' }, { label: 'Shape', value: 'Slim' }] },
  { name: 'Dressing Table', slug: 'dressing-table', sku: 'LIV-003', description: 'A graceful dressing table for elegant interiors.', categorySlug: 'living-room', image: 'https://images.unsplash.com/photo-1605116959031-6e2d13a2ee56?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Walnut Wood' }, { label: 'Use', value: 'Dressing' }] },
  { name: 'Pine Breakfast Table', slug: 'pine-breakfast-table', sku: 'KIT-001', description: 'A warm, practical kitchen table for everyday meals.', categorySlug: 'kitchen-tables', image: 'https://images.unsplash.com/photo-1758977404712-5d5165c66e4a?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Pinewood' }, { label: 'Use', value: 'Kitchen' }] },
  { name: 'Isle Dining Table', slug: 'isle-dining-table', sku: 'KIT-002', description: 'A durable kitchen table designed for family dining.', categorySlug: 'kitchen-tables', image: 'https://images.unsplash.com/photo-1758977404499-32e2cae3c846?auto=format&fit=crop&w=900&q=80', attributes: [{ label: 'Material', value: 'Solid Oak' }, { label: 'Use', value: 'Kitchen' }] },
];

async function ensureCategory(prismaClient: PrismaClient | Prisma.TransactionClient, data: { name: string; slug: string; description: string; image: string; order: number }) {
  const existing = await prismaClient.category.findUnique({ where: { slug: data.slug } });

  if (existing) {
    return prismaClient.category.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        order: data.order,
        parentId: null,
      },
    });
  }

  return prismaClient.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      order: data.order,
      parentId: null,
    },
  });
}

async function ensureSubCategory(prismaClient: PrismaClient | Prisma.TransactionClient, parentId: string, data: { name: string; slug: string; description: string; image: string }) {
  const existing = await prismaClient.category.findUnique({ where: { slug: data.slug } });

  if (existing) {
    return prismaClient.category.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        description: data.description,
        parentId,
        image: data.image,
      },
    });
  }

  return prismaClient.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId,
      image: data.image,
    },
  });
}

async function ensureProduct(prismaClient: PrismaClient | Prisma.TransactionClient, categorySlug: string, data: { name: string; slug: string; sku: string; description: string; image: string; attributes: Array<{ label: string; value: string }> }) {
  const category = await prismaClient.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return null;

  const existing = await prismaClient.product.findUnique({ where: { slug: data.slug } });
  const product = existing
    ? await prismaClient.product.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          sku: data.sku,
          description: data.description,
          brand: 'Sulochana',
          status: 'ACTIVE',
          categoryId: category.id,
        },
      })
    : await prismaClient.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          brand: 'Sulochana',
          status: 'ACTIVE',
          categoryId: category.id,
        },
      });

  const existingImage = await prismaClient.productImage.findFirst({ where: { productId: product.id } });
  if (!existingImage) {
    await prismaClient.productImage.create({
      data: {
        productId: product.id,
        url: data.image,
        order: 1,
      },
    });
  }

  await prismaClient.productAttribute.deleteMany({ where: { productId: product.id } });
  if (data.attributes.length) {
    await prismaClient.productAttribute.createMany({
      data: data.attributes.map((attribute) => ({ productId: product.id, label: attribute.label, value: attribute.value })),
    });
  }

  return product;
}

export async function seedDatabase(prismaClient: PrismaClient | Prisma.TransactionClient) {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prismaClient.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: { password: hashedPassword, name: 'Admin' },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  await prismaClient.siteSetting.upsert({
    where: { id: 'singleton' },
    update: {
      contactEmail: 'hello@sulochanafurniture.com',
      contactPhone: '+91 75503 50009',
      whatsappNumber: '917550350009',
      address: '1A2, Udumalai Road, Chinnampalayam, Pollachi',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31368.618642233967!2d76.97796857407555!3d10.651100501103654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba837b4b87bae69%3A0xc458ac7e19f5f4a0!2sSulochana%20Furniture!5e0!3m2!1sen!2sin!4v1785499318455!5m2!1sen!2sin',
      storyTitle: 'Crafted for modern homes',
      storyContent: 'Sulochana Furniture creates timeless pieces for everyday living.',
      storyImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      aboutBanner: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    },
    create: {
      id: 'singleton',
      contactEmail: 'hello@sulochanafurniture.com',
      contactPhone: '+91 75503 50009',
      whatsappNumber: '917550350009',
      address: '1A2, Udumalai Road, Chinnampalayam, Pollachi',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31368.618642233967!2d76.97796857407555!3d10.651100501103654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba837b4b87bae69%3A0xc458ac7e19f5f4a0!2sSulochana%20Furniture!5e0!3m2!1sen!2sin!4v1785499318455!5m2!1sen!2sin',
      storyTitle: 'Crafted for modern homes',
      storyContent: 'Sulochana Furniture creates timeless pieces for everyday living.',
      storyImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      aboutBanner: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    },
  });

  for (const definition of categoryDefinitions) {
    const category = await ensureCategory(prismaClient, definition);

    for (const subcategory of definition.subcategories) {
      await ensureSubCategory(prismaClient, category.id, { ...subcategory, image: definition.image });
    }
  }

  for (const product of productDefinitions) {
    await ensureProduct(prismaClient, product.categorySlug, product);
  }

  const bannerDefinitions = [
    {
      id: 'banner-1',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
      title: 'Timeless Sofas for Modern Living',
      subtitle: 'Discover living room seating that blends lasting comfort with refined craftsmanship.',
      ctaLabel: 'Shop Sofas',
      ctaUrl: '/category/sofas',
      order: 1,
      active: true,
    },
    {
      id: 'banner-2',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      title: 'Bedroom Comfort, Built to Last',
      subtitle: 'Explore premium bed collections designed for restful nights and elegant interiors.',
      ctaLabel: 'Explore Beds',
      ctaUrl: '/category/beds',
      order: 2,
      active: true,
    },
    {
      id: 'banner-3',
      image: 'https://images.unsplash.com/photo-1758977404499-32e2cae3c846?auto=format&fit=crop&w=1600&q=80',
      title: 'Dining Spaces Made for Gathering',
      subtitle: 'Bring home handcrafted wooden dining sets that elevate everyday meals and celebrations.',
      ctaLabel: 'View Dining Sets',
      ctaUrl: '/category/dining',
      order: 3,
      active: true,
    },
  ];

  for (const banner of bannerDefinitions) {
    await prismaClient.banner.upsert({
      where: { id: banner.id },
      update: {
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaLabel: banner.ctaLabel,
        ctaUrl: banner.ctaUrl,
        order: banner.order,
        active: banner.active,
      },
      create: banner,
    });
  }

  const testimonialDefinitions = [
    { id: 'testimonial-1', name: 'Meera Rao', quote: 'Beautiful craftsmanship and exceptional service from start to finish.', rating: 5, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-2', name: 'Arun Kumar', quote: 'The sofa feels luxurious and the delivery experience was smooth and professional.', rating: 5, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-3', name: 'Divya Menon', quote: 'We found the perfect dining set for our home and loved the attention to detail.', rating: 5, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-4', name: 'Sanjay Pillai', quote: 'The wardrobe quality is fantastic and the finish looks premium.', rating: 4, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-5', name: 'Nisha Thomas', quote: 'Every piece feels sturdy, elegant, and worth the investment.', rating: 5, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-6', name: 'Raghav Sharma', quote: 'Our office furniture arrived on time and instantly upgraded the space.', rating: 5, photo: 'https://images.unsplash.com/photo-1504593811423-6cbb8961c6dc?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-7', name: 'Anjali Verma', quote: 'The team helped us choose pieces that fit both style and comfort.', rating: 5, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-8', name: 'Karthik Iyer', quote: 'The dining table is beautifully crafted and very solid.', rating: 4, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-9', name: 'Priya Nair', quote: 'We loved the warmth of the finishes and the comfort of the seating.', rating: 5, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-10', name: 'Vikram Bhat', quote: 'Great furniture, thoughtful guidance, and excellent after-sales support.', rating: 5, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-11', name: 'Shalini Das', quote: 'The sofa and coffee table brought so much life to our living room.', rating: 4, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80', featured: true },
    { id: 'testimonial-12', name: 'Mohan Raj', quote: 'Excellent quality and very comfortable pieces for everyday use.', rating: 5, photo: 'https://images.unsplash.com/photo-1504593811423-6cbb8961c6dc?auto=format&fit=crop&w=400&q=80', featured: true },
  ];

  for (const testimonial of testimonialDefinitions) {
    await prismaClient.testimonial.upsert({
      where: { id: testimonial.id },
      update: {
        name: testimonial.name,
        quote: testimonial.quote,
        rating: testimonial.rating,
        photo: testimonial.photo,
        featured: testimonial.featured,
      },
      create: {
        id: testimonial.id,
        name: testimonial.name,
        quote: testimonial.quote,
        rating: testimonial.rating,
        photo: testimonial.photo,
        featured: testimonial.featured,
      },
    });
  }

  await prismaClient.menuItem.createMany({
    data: [
      { location: 'MAIN', label: 'Home', url: '/', order: 1 },
      { location: 'MAIN', label: 'Collections', url: '/collections', order: 2 },
      { location: 'MAIN', label: 'About', url: '/about', order: 3 },
      { location: 'FOOTER', label: 'Contact', url: '/contact', order: 1 },
      { location: 'FOOTER', label: 'Privacy', url: '/privacy', order: 2 },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created successfully');
}

async function main() {
  await seedDatabase(prisma);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
