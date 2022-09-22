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