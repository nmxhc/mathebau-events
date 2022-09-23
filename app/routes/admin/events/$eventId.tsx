import { useCatch, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import moment from 'moment';
import { useRef } from 'react';
import { EventSignupInfo } from '~/components/admin/events/EventSignupInfo';
import { Box } from '~/components/elementary/Box';
import { Button } from '~/components/elementary/Button';
import { H1 } from '~/components/elementary/H1'
import { H2 } from '~/components/elementary/H2';
import { SpaceY } from '~/components/elementary/SpaceY';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import { deleteEvent, getEventWithAdminDetails } from '~/models/event.server'
import { requireAdminId } from '~/session_admin.server';
import { EventSignupTable, handleDownloadCsv } from '~/components/admin/events/EventSignupTable';
import { unvalidateEmailOfParticipant, validateEmailOfParticipant } from '~/models/participant.server';
import { deleteSinupById } from '~/models/signup.server';
import type { DeleteEventModalHandle } from '~/components/admin/events/event/DeleteEventModal';
import { DeleteEventModal } from '~/components/admin/events/event/DeleteEventModal';

type LoaderData = {
  event: NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const adminId = await requireAdminId(request);
  const event = await getEventWithAdminDetails(params.eventId)
  
  if (!event) {
    throw new Response("Event not found", {
      status: 404,
    })
  }

  if (event.eventAdmins.findIndex(ea => ea.adminId === adminId) === -1) {
    throw new Response("Unauthorized to view Event", {
      status: 401,
    })
  }

  return json<LoaderData>({ event })
}

export const action:ActionFunction = async ({ request, params }) => {
  const adminId = await requireAdminId(request);
  const event = await getEventWithAdminDetails(params.eventId)

  if (!event) {
    throw new Response("Event not found", {
      status: 404,
    })
  }

  if (event.eventAdmins.findIndex(ea => ea.adminId === adminId) === -1) {
    throw new Response("Unauthorized", {
      status: 401,
    })
  }

  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'delete-event') {
    await deleteEvent(event.id)
    return redirect(`/admin/events`)
  }

  if (action === 'update-email-validation') {
    const signupId = formData.get('signupId');
    const validatedEmail = formData.has('validatedEmail');
    const emailValidationToken = event.signups.find(s => s.id === signupId)?.participant.emailValidationToken;
    if (validatedEmail) {
      await validateEmailOfParticipant(emailValidationToken)
    } else {
      await unvalidateEmailOfParticipant(emailValidationToken)
    }
  }

  if (action === 'delete-signup') {
    const signupId = formData.get('signupId') as string;
    await deleteSinupById(signupId);
  }

  return redirect(`/admin/events/${event.id}`)
}

const EventDetailsPage = () => {
  const { event } = useLoaderData() as LoaderData;
  const deleteModalRef = useRef<DeleteEventModalHandle>(null);

  return (
    <div data-cy='admin-event-page'>
      <SplitLeftRight>
        <H1>{event.name}</H1>
        <Button dataCy='delete-event-button' color='red' className='mb-3' onClick={() => deleteModalRef.current?.toggleModal()}>  
          Event Löschen
        </Button>
      </SplitLeftRight>
      <SpaceY>
        <Box>
          <H2>Infos zum Event</H2>
          <p><b>Event-Name:</b> {event.name}</p>
          <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {`bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
          <p><b>Wo?</b> {event.location}</p>
          <p><b>Was?</b> {event.description}</p>
          { event.cost && <p><b>Kosten:</b> {event.cost}</p> }
          <p><b>Anmeldezeitraum:</b> {moment(event.signupStartDate).format('DD.MM.YYYY')} bis {moment(event.signupEndDate).format('DD.MM.YYYY')}</p>
          <p><b>Teilnehmer-Limit:</b> {event.participantsLimit ? `${event.participantsLimit}` : 'Kein Limit'} </p>
        </Box>
        <Box>
          <H2>Event Status</H2>
          <p><b>Anmeldungen:</b> XX{event.participantsLimit && `/${event.participantsLimit}`} </p>
          <EventSignupInfo event={event} />
        </Box>
        <Box>
          <SplitLeftRight>
            <H2>Anmeldungen</H2>
            <Button color='lime' onClick={() => handleDownloadCsv(event)}>
              CSV-Export
            </Button>
          </SplitLeftRight>
          <EventSignupTable event={event} />
        </Box>
        <Box>
          <H2>Administratoren</H2>
          {event.eventAdmins.map(ea => (
            <p key={ea.adminId}><b>{ea.admin.name}</b>: {ea.admin.email}</p>
          ))}
        </Box>
      </SpaceY>

      <DeleteEventModal eventName={event.name} ref={deleteModalRef} />
    </div>
  )
}

export default EventDetailsPage

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div data-cy='catch-boundary'>
      <H1>{caught.status} Error: {caught.data}</H1>
    </div>
  )
}