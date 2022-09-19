import type { Signup } from "@prisma/client";
import { prisma } from '~/db.server';

export type { Signup } from "@prisma/client";

export function signupParticipant({eventId, participantId}: Pick<Signup, 'eventId'|'participantId'>) {
  return prisma.signup.create({
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