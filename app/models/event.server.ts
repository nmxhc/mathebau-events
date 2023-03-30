import type { Admin, Event } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Event } from "@prisma/client";

export function getUpcomingEvents() {
  return prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      }
    },
    orderBy: { startDate: "asc" },
  });
}

export function getAdminEvents(adminId: Admin["id"]) {
  return prisma.event.findMany({
    where: {
      eventAdmins: {
        some: {
          adminId
        }
      },
    },
    include: {
      signups: {
        select: {
          id: true,
        }
      }
    },
    orderBy: { startDate: "asc" },
  });
}

export type createEventArguments = {
  event: Pick<
    Event, 'name'|'description'|'location'|'startDate'|'endDate'|'signupStartDate'|'signupEndDate'|'participantsLimit'|'cost'|'visible'
  >,
  customFieldIds: string[],
  adminId: Admin["id"],
}

export async function createEvent({event, adminId, customFieldIds}:createEventArguments) {
  return await prisma.event.create({
    data: {
      ...event,
      eventAdmins: {
        create: {
          adminId
        }
      },
      eventInputFields: {
        create: customFieldIds.map((id) => ({
          inputFieldId: id,
        })),
      }
    }
  });
}

export async function getEventWithAdminDetails(eventId?: Event["id"]) {
  return await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      eventAdmins: {
        include: {
          admin: true,
        }
      },
      signups: {
        include: {
          participant: true,
          signupEventInputValues: {
            include: {
              eventInputField: {
                include: {
                  inputField: true,
                }
              },
            }
          }
        }
      },
      eventInputFields: {
        include: {
          inputField: true,
        }
      }
    },
  });
}

export async function deleteEvent(eventId: Event["id"]) {
  return await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
}

export async function getEventById(eventId?: Event["id"]) {
  return await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      eventInputFields: {
        where: {
          inputField: {
            adminOnly: false,
          }
        },
        include: {
          inputField: {
            include: {
              options: true,
            },
          }
        }
      },
      signups: {
        select: {
          id: true,
        }
      }
    }
  });
}

export async function updateEvent(eventId: Event["id"], event: Partial<Event>) {
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: event,
  });
}

export async function setVisibility(eventId: Event["id"], visible: boolean) {
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      visible,
    }
  });
}

export async function addAdminToEvent(eventId: Event["id"], adminId: Admin["id"]) {
  return await prisma.eventAdmin.create({
    data: {
      eventId,
      adminId,
    }
  });
}