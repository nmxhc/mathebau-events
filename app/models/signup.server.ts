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