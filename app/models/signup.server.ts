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
        value: customFields[eIF.inputField.name] || (eIF.inputField.typeId === "checkbox" ? "false" : ""),
        })),
      }
    },
  });
}

export async function getSignupById(signupId?: string) {
  return await prisma.signup.findUnique({
    where: {
      id: signupId,
    },
    include: getSignupInclude
  });
}

export async function deleteSinupById(signupId?: string) {
  const signup = await prisma.signup.findUnique({
    where: {
      id: signupId,
    },
    select: {
      participant: true
    }
  });
  if (signup?.participant.dedicatedToOneSignup) {
    await prisma.participant.delete({
      where: {
        id: signup.participant.id,
      }
    }); // cascade-deletes the signup
  } else {
    await prisma.signup.delete({
      where: {
        id: signupId,
      }
    });
  }
  return signup;
}

export async function getSignupByParticipantId(participantId: string) {
  return await prisma.signup.findFirst({
    where: {
      participantId,
    },
    include: getSignupInclude
  });
}

const getSignupInclude = {
  event: {
    include: {
      eventAdmins: {
        include: {
          admin: true,
        }
      }
    }
  },
  participant: true,
  signupEventInputValues: {
    include: {
      eventInputField: {
        include: {
          inputField: true,
        }
      }
    }
  }
}

export async function isSignupOnWaitlist(signupId: string) {
  const signup = await prisma.signup.findUnique({
    where: {
      id: signupId,
    },
    include: getSignupInclude
  });
  if (signup?.event.participantsLimit) {
    const signups = await prisma.signup.findMany({
      orderBy: {
        signupTime: "asc",
      },
      select: {
        id: true,
      }
    })
    const signupIndex = signups.findIndex((s) => s.id === signupId);
    return signupIndex >= signup.event.participantsLimit;
  } else {
    return false;
  }
}