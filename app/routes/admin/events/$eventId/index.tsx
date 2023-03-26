import { Link } from '@remix-run/react';
import moment from 'moment';
import { Button } from '~/components/elementary/Button';
import { H2 } from '~/components/elementary/H2';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import type { getEventWithAdminDetails } from '~/models/event.server'
import { useMatchesData } from '~/utils';

type LoaderData = {
  event: NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>
}

const EventDetailsPage = () => {
  const { event } = useMatchesData('routes/admin/events/$eventId') as LoaderData;

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
    </div>
  )
}

export default EventDetailsPage