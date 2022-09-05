import { getEventById } from '~/models/event.server';

export async function requireEvent(eventId?:string) {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Response("Event not found", {
      status: 404,
    })
  }
  return event
}