import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@ananta.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "SUPER_ADMIN",
    },
    create: {
      email,
      name: "Anant (Website Owner)",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin account claimed successfully:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
