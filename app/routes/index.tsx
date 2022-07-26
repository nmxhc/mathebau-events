import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Event} from '~/models/event.server';
import { getUpcomingEvents } from '~/models/event.server';
import moment from "moment";
import { H1 } from '~/components/elementary/H1';
import { Box } from '~/components/elementary/Box';
import { H2 } from '~/components/elementary/H2';

type LoaderData = {
  upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>>;
};

export const loader: LoaderFunction = async () => {
  const upcomingEvents = await getUpcomingEvents();
  return json<LoaderData>({ upcomingEvents });
}

export default function Index() {
  const { upcomingEvents } = useLoaderData();
  return (
    <>
      <H1>Anstehende Events:</H1>
      <div className='space-y-3'>
        {upcomingEvents.map((event: Event) => (
          <Box key={event.id}>
            <H2>{event.name}</H2>
            <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {event.endDate && `bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
            <p><b>Wo?</b> {event.location}</p>
            <p><b>Was?</b> {event.description}</p>
            { event.cost && <p><b>Kosten:</b> {event.cost}</p> }
          </Box>
        ))}
      </div>
    </>
  );
}
