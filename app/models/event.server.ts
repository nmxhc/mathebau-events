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
    orderBy: { startDate: "asc" },
  });
}

export type createEventArguments = {
  event: Pick<
    Event, 'name'|'description'|'location'|'startDate'|'endDate'|'signupStartDate'|'signupEndDate'|'participantsLimit'|'cost'
  >,
  adminId: Admin["id"],
}

export async function createEvent({event, adminId}:createEventArguments) {
  return await prisma.event.create({
    data: {
      ...event,
      eventAdmins: {
        create: {
          adminId
        }
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