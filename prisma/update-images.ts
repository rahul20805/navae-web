import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Updating category images...");
  await prisma.category.update({
    where: { slug: "gifts-corner" },
    data: { image: "/images/gifts_corner.jpg" }
  });
  await prisma.category.update({
    where: { slug: "bracelets-jewelry" },
    data: { image: "/images/handmade_bracelets.jpg" }
  });
  await prisma.category.update({
    where: { slug: "handmade-crafts" },
    data: { image: "/images/resin_art.jpg" }
  });

  console.log("Updating class images...");
  await prisma.class.update({
    where: { slug: "mehandi-workshop" },
    data: { image: "/images/mehandi_workshop.jpg" }
  });
  await prisma.class.update({
    where: { slug: "art-craft-workshop" },
    data: { image: "/images/resin_art.jpg" }
  });
  await prisma.class.update({
    where: { slug: "home-tuition-art" },
    data: { image: "/images/resin_art.jpg" }
  });

  console.log("Updating service images...");
  await prisma.service.update({
    where: { slug: "home-tuition" },
    data: { image: "/images/resin_art.jpg" }
  });
  await prisma.service.update({
    where: { slug: "contract-design" },
    data: { image: "/images/gifts_corner.jpg" }
  });

  console.log("Successfully updated all images!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
