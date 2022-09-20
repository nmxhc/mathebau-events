import type { PrismaClient } from '@prisma/client';

export type InputFieldTypeSeedData = string; 

export interface InputFieldSeedData {
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export async function seedInputFieldType(prisma: PrismaClient, type: InputFieldTypeSeedData) {
  return await prisma.inputFieldType.create({
    data: {
      name: type,
    },
  });
}

export async function seedInputFieldTypes(prisma: PrismaClient, types: InputFieldTypeSeedData[]) {
  for (const type of types) {
    await seedInputFieldType(prisma, type);
  }
}

export async function seedInputField(prisma: PrismaClient, inputField: InputFieldSeedData) {
  return await prisma.inputField.create({
    data: {
      name: inputField.name,
      type: {
        connect: {
          name: inputField.type,
        },
      },
      required: inputField.required,
      options: {
        create: inputField.options?.map((option) => ({ name: option })) || [],
      },
    },
  });
}

export async function seedInputFields(prisma: PrismaClient, inputFields: InputFieldSeedData[]) {
  for (const inputField of inputFields) {
    await seedInputField(prisma, inputField);
  }
}
