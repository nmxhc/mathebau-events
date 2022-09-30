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

export async function createCustomField({ name, type, options, required, adminOnly }: { name: string, type: string, options?: string[], required:boolean, adminOnly:boolean }) {
  return await prisma.inputField.create({
    data: {
      name,
      type: {
        connect: {
          name: type,
        },
      },
      required,
      adminOnly,
      options: {
        create: options?.map((option) => ({ name: option })) || [],
      },
    },
  });
}

export async function getPaidInputField() {
  return await prisma.inputField.findFirst({
    where: {
      name: "Bezahlt",
      adminOnly: true,
    },
  });
}

export async function getCommentsField() {
  return await prisma.inputField.findFirst({
    where: {
      name: "Kommentare",
      adminOnly: true,
    },
  });
}

export async function getCustomFieldTypes() {
  return await prisma.inputFieldType.findMany();
}

export async function updateCustomInputValue({ signupId, value, eventInputFieldId }: { signupId: string, value: string, eventInputFieldId: string }) {
  return await prisma.signupEventInputValue.update({
    where: {
      signupId_eventInputFieldId: {
        signupId,
        eventInputFieldId,
      }
    },
    data: {
      value,
    },
  });
}
