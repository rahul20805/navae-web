import 'dotenv/config';
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Update any existing "Navya" to "Anant"
  const existingUsers = await prisma.user.findMany({ where: { name: 'Navya' } });
  for (const user of existingUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: 'Anant' }
    });
    console.log(`Updated user ${user.email} name from Navya to Anant`);
  }

  const superAdminEmail = 'admin@ananta.in';
  const ownerEmail = 'owner@ananta.in';
  
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 10);
  const ownerPassword = await bcrypt.hash('Owner@123', 10);

  // Setup Super Admin
  const existingSuperAdmin = await prisma.user.findUnique({ where: { email: superAdminEmail } });
  if (existingSuperAdmin) {
    await prisma.user.update({
      where: { email: superAdminEmail },
      data: { role: 'OWNER', password: superAdminPassword, name: 'Anant (Super Admin)' }
    });
    console.log('Updated Super Admin. Email: ' + superAdminEmail + ', Password: SuperAdmin@123');
  } else {
    await prisma.user.create({
      data: {
        name: 'Anant (Super Admin)',
        email: superAdminEmail,
        password: superAdminPassword,
        role: 'OWNER'
      }
    });
    console.log('Created Super Admin. Email: ' + superAdminEmail + ', Password: SuperAdmin@123');
  }

  // Setup Owner
  const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (existingOwner) {
    await prisma.user.update({
      where: { email: ownerEmail },
      data: { role: 'OWNER', password: ownerPassword, name: 'Anant (Owner)' }
    });
    console.log('Updated Owner. Email: ' + ownerEmail + ', Password: Owner@123');
  } else {
    await prisma.user.create({
      data: {
        name: 'Anant (Owner)',
        email: ownerEmail,
        password: ownerPassword,
        role: 'OWNER'
      }
    });
    console.log('Created Owner. Email: ' + ownerEmail + ', Password: Owner@123');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
