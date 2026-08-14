import 'dotenv/config';
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = 'admin@ananta.in';
  const password = 'Admin@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'OWNER', password: hashedPassword }
    });
    console.log('Updated existing user to OWNER. Password set to: ' + password);
  } else {
    await prisma.user.create({
      data: {
        name: 'Navya',
        email,
        password: hashedPassword,
        role: 'OWNER'
      }
    });
    console.log('Created new OWNER user. Password set to: ' + password);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
