import type { PrismaClient } from '@prisma/client';
import { dateStringPlusDays, getTodayDateString } from '~/utils/dates';

export type SeedDateArray  = [
  number,
  'days-ago'|'days-from-now'
]

export interface EventSeedData {
  name: string;
  description: string;
  location: string;
  startDate: string | SeedDateArray;
  endDate: string | SeedDateArray;
  signupStartDate: string | SeedDateArray;
  signupEndDate: string | SeedDateArray;
  participantsLimit?: number;
  cost?: string;
  admins?: string[];
}

function getDate(date: string | SeedDateArray): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  const daysFromToday = date[1] === 'days-from-now' ? date[0] : -date[0];
  return new Date(dateStringPlusDays(getTodayDateString(), daysFromToday));
}

export async function seedEvent(prisma: PrismaClient, event: EventSeedData) {
  await prisma.event.create({
    data: {
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: getDate(event.startDate),
      endDate: getDate(event.endDate),
      signupStartDate: getDate(event.signupStartDate),
      signupEndDate: getDate(event.signupEndDate),
      participantsLimit: event.participantsLimit,
      cost: event.cost,
    },
  });
}

export async function seedEvents(prisma: PrismaClient, events: EventSeedData[]) {
  for (const event of events) {
    await seedEvent(prisma, event);
  }
}
