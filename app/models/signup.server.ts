import type { Signup } from "@prisma/client";
import { prisma } from '~/db.server';

export type { Signup } from "@prisma/client";

export async function signupParticipant({eventId, participantId, customFields}: Pick<Signup, 'eventId'|'participantId'> & {customFields: Record<string, string>}) {
  const eIFs = await prisma.eventInputField.findMany({
    where: {
      eventId,
    },
    select: {
      inputField: true,
      id: true
    },
  });
  return await prisma.signup.create({
    data: {
      event: {
        connect: {
          id: eventId,
        },
      },
      participant: {
        connect: {
          id: participantId,
        },
      },
      signupEventInputValues : {
        create: eIFs.map((eIF) => ({
          eventInputField: {
            connect: {
              id: eIF.id,
            },
          },
          value: customFields[eIF.inputField.name],
        })),
      }
    },
  });
}

export function getSignupById(signupId?: string) {
  return prisma.signup.findUnique({
    where: {
      id: signupId,
    },
    include: {
      event: true,
      participant: true,
    }
  });
}