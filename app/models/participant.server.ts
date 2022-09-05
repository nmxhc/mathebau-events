import type { Participant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Participant } from "@prisma/client";

type createParticipantArguments = Pick<Participant, 'name'|'email'|'dedicatedToOneSignup'>

export function createParticipant(participant: createParticipantArguments) {
  return prisma.participant.create({
    data: {
      ...participant,
    },
  });
}
