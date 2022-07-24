import type { Admin, Event } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Event } from "@prisma/client";

// export function getNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.findFirst({
//     select: { id: true, body: true, title: true },
//     where: { id, userId },
//   });
// }

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

export function createEvent({
  name,
  description,
  location,
  startDate,
  endDate,
  signupStartDate,
  signupEndDate,
  participantsLimit,
  cost,
  adminId
}: Pick<Event, 'name'|'description'|'location'|'startDate'|'endDate'|'signupStartDate'|'signupEndDate'> & {adminId: Admin["id"], participantsLimit?: number, cost?: string}) {
  return prisma.event.create({
    data: {
      name,
      description,
      location,
      startDate,
      endDate,
      signupStartDate,
      signupEndDate,
      participantsLimit,
      cost,
      eventAdmins: {
        create: {
          adminId
        }
      }
    }
  });
}

// export function createNote({
//   body,
//   title,
//   userId,
// }: Pick<Note, "body" | "title"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.create({
//     data: {
//       title,
//       body,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });
// }

// export function deleteNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & { userId: User["id"] }) {
//   return prisma.note.deleteMany({
//     where: { id, userId },
//   });
// }