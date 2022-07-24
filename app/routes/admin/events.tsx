import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction} from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { AdminEventBox } from '~/components/AdminEventBox';
import { Footer } from '~/components/Footer';
import { H1 } from '~/components/H1';
import { Main } from '~/components/Main';
import { Navbar } from '~/components/Navbar';
import { PageWrapper } from '~/components/PageWrapper';
import type { Event} from '~/models/event.server';
import { getAdminEvents } from '~/models/event.server';
import { requireAdminId } from '~/session_admin.server';

type LoaderData = {
  events: Awaited<ReturnType<typeof getAdminEvents>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminId = await requireAdminId(request);
  const events = await getAdminEvents(adminId);
  return json<LoaderData>({events});
};

export default function EventsPage() {
  const { events } = useLoaderData();
  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <H1>Deine Aktuellen Events:</H1>
        {events.filter((event: Event) => new Date() < new Date(event.endDate) ).map((event: Event) => (
          <AdminEventBox event={event} key={event.id} />
        ))}
        <Link to='/admin/new-event' className='flex'>
          <button className='mx-3 sm:mx-0 mt-5 px-4 py-2 flex-grow bg-lime-600 text-lime-50 rounded-md hover:bg-lime-700 transition duration-200 ease-in-out'><b>Neues Event</b></button>
        </Link>
        <H1>Deine Vergangenen Events:</H1>
        {events.filter((event: Event) => new Date(event.endDate) < new Date()).map((event: Event) => (<AdminEventBox event={event} key={event.id} />))}
      </Main>
      <Footer />
    </PageWrapper>
        
  )
}
