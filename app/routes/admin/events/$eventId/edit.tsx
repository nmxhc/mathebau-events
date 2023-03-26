import { Link } from '@remix-run/react';
import { EventDataInputs } from '~/components/admin/events/new/EventDataInputs';
import { Button } from '~/components/elementary/Button';
import { H2 } from '~/components/elementary/H2';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import type { getEventWithAdminDetails } from '~/models/event.server'
import { useMatchesData } from '~/utils';

type LoaderData = {
  event: NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>
}

const EventEditPage = () => {
  const { event } = useMatchesData('routes/admin/events/$eventId') as LoaderData;

  return (
    <div data-cy='admin-event-page-edit'>
      <SplitLeftRight>
        <H2>Event Bearbeiten</H2>
        <Link to={`/admin/events/${event.id}`}>
          <Button color='stone'>Abbrechen</Button>
        </Link>
      </SplitLeftRight>
      <EventDataInputs defaultValues={event} />
    </div>
  )
}

export default EventEditPage