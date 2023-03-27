import { Link } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import moment from 'moment';
import { env } from 'process';
import { Button } from '~/components/elementary/Button';
import { H2 } from '~/components/elementary/H2';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import { useMatchesData } from '~/utils';
import type { LoaderData } from '../$eventId';

export const loader:LoaderFunction = async ({ params }) => {
  return {
    base_url: env.BASE_URL
  }
}

const EventDetailsPage = () => {
  const { event } = useMatchesData('routes/admin/events/$eventId') as LoaderData;
  const { base_url } = useMatchesData('routes/admin/events/$eventId/index') as { base_url: string };

  return (
    <div data-cy='admin-event-page-info'>
      <SplitLeftRight>
        <H2>Infos zum Event</H2>
        <Link to={`/admin/events/${event.id}/edit`}>
          <Button color='lime'>Bearbeiten</Button>
        </Link>
      </SplitLeftRight>
      <p><b>Event-Name:</b> {event.name}</p>
      <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {`bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
      <p><b>Wo?</b> {event.location}</p>
      <p><b>Was?</b> {event.description}</p>
      { event.cost && <p><b>Kosten:</b> {event.cost}</p> }
      <p><b>Anmeldezeitraum:</b> {moment(event.signupStartDate).format('DD.MM.YYYY')} bis {moment(event.signupEndDate).format('DD.MM.YYYY')}</p>
      <p><b>Teilnehmer-Limit:</b> {event.participantsLimit ? `${event.participantsLimit}` : 'Kein Limit'} </p>
      <div className='flex justify-start align-center'>
      <p><b>Anmeldelink:</b></p>
        <Link to={`/anmelden/${event.id}`} className='text-blue-300 ml-3'>
          {`${base_url}/anmelden/${event.id}`}
        </Link>
      </div>
    </div>
  )
}

export default EventDetailsPage