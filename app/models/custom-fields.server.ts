import { prisma } from "~/db.server";

export type { InputField } from "@prisma/client";

export async function getCustomFields() {
  return await prisma.inputField.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      options: true,
    }
  });
}

export async function createCustomField({ name, type, options }: { name: string, type: string, options?: string[] }) {
  return await prisma.inputField.create({
    data: {
      name,
      type: {
        connect: {
          name: type,
        },
      },
      options: {
        create: options?.map((option) => ({ name: option })) || [],
      },
    },
  });
}


export async function getCustomFieldTypes() {
  return await prisma.inputFieldType.findMany();
}