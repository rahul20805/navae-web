import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding dummy data...');

  // 1. Create a Category
  const category = await prisma.category.upsert({
    where: { slug: 'resin-art' },
    update: {},
    create: {
      name: 'Resin Art',
      slug: 'resin-art',
      description: 'Beautiful handmade resin crafts and nameplates.',
    },
  });

  // 2. Create a Product
  await prisma.product.upsert({
    where: { slug: 'custom-resin-nameplate' },
    update: {},
    create: {
      name: 'Custom Resin Nameplate',
      slug: 'custom-resin-nameplate',
      description: 'A beautiful, personalized resin nameplate perfect for your home entrance. Handcrafted with premium epoxy resin, gold flakes, and dried flowers.',
      price: 1499.00,
      stock: 10,
      categoryId: category.id,
      images: ['https://images.unsplash.com/photo-1606722590583-6951b5ea92cb?q=80&w=800&auto=format&fit=crop'],
    },
  });

  // 3. Create a Class
  await prisma.class.upsert({
    where: { slug: 'beginner-resin-workshop' },
    update: {},
    create: {
      title: 'Beginner Resin Art Workshop',
      slug: 'beginner-resin-workshop',
      description: 'Learn the basics of mixing, pouring, and curing epoxy resin. Create your own coasters and take them home! Materials provided.',
      instructor: 'Anant',
      schedule: 'Saturday, 10:00 AM - 12:00 PM',
      duration: '2 Hours',
      price: 999.00,
      maxStudents: 15,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
