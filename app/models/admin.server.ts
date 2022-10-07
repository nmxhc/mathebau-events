import type { AdminPassword, Admin } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { Admin } from "@prisma/client";

export async function getAdminById(id: Admin["id"]) {
  return prisma.admin.findUnique({ where: { id } });
}

export async function getAdminByEmail(email: Admin["email"]) {
  return prisma.admin.findUnique({ where: { email } });
}

export type CreateAdminArguments = {email: Admin["email"], name:Admin["name"], password: string}

export async function createAdmin({email, name, password} : CreateAdminArguments) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.admin.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteAdmin(id: Admin["id"]) {
  return prisma.admin.delete({ where: { id } });
}

export async function verifyAdminLogin(
  email: Admin["email"],
  password: AdminPassword["hash"]
) {
  const adminWithPassword = await prisma.admin.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!adminWithPassword || !adminWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    adminWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...adminWithoutPassword } = adminWithPassword;

  return adminWithoutPassword;
}
