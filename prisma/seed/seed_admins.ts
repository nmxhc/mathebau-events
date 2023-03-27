import type { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

export interface AdminSeedData {
  name: string;
  email: string;
  password: string;
}

export async function seedAdmin(prisma: PrismaClient, admin: AdminSeedData) {
  await prisma.admin.create({
    data: {
      email: admin.email,
      name: admin.name,
      password: {
        create: {
          hash: await bcrypt.hash(admin.password, 10),
        },
      },
    },
  });
}

export async function seedAdmins(prisma: PrismaClient, admins: AdminSeedData[]) {
  for (const admin of admins) {
    await seedAdmin(prisma, admin);
  }
}
