import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Navbar } from '~/components/Navbar';
import type { Event} from '~/models/event.server';
import { getUpcomingEvents } from '~/models/event.server';
// import { useOptionalAdmin } from "~/utils";
import moment from "moment";
import { Footer } from '~/components/Footer';
import { PageWrapper } from '~/components/PageWrapper';
import { H1 } from '~/components/H1';
import { Main } from '~/components/Main';

type LoaderData = {
  upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>>;
};

export const loader: LoaderFunction = async () => {
  const upcomingEvents = await getUpcomingEvents();
  return json<LoaderData>({ upcomingEvents });
}

export default function Index() {
  // const admin = useOptionalAdmin();
  const { upcomingEvents } = useLoaderData();
  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <H1>Anstehende Events:</H1>
        <div className=''>
          {upcomingEvents.map((event: Event) => (
            <div key={event.id} className='px-3 py-3 bg-stone-800 sm:rounded-md'>
              <h2 className='text-2xl text-lime-200'>{event.name}</h2>
              <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {event.endDate && `bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
              <p><b>Wo?</b> {event.location}</p>
              <p><b>Was?</b> {event.description}</p>
              { event.cost && <p><b>Kosten:</b> {event.cost}</p> }
            </div>
          ))}
        </div>
      </Main>
      <Footer />
    </PageWrapper>
  );
}
