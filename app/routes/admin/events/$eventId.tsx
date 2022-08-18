import { useCatch, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import moment from 'moment';
import { EventSignupInfo } from '~/components/admin/events/EventSignupInfo';
import { Box } from '~/components/elementary/Box';
import { Button } from '~/components/elementary/Button';
import { DangerButton } from '~/components/elementary/DangerButton';
import { H1 } from '~/components/elementary/H1'
import { H2 } from '~/components/elementary/H2';
import { SpaceY } from '~/components/elementary/SpaceY';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import { getEventWithAdminDetails } from '~/models/event.server'
import { requireAdminId } from '~/session_admin.server';

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

const EventDetailsPage = () => {
  const { event } = useLoaderData() as LoaderData;
  return (
    <div data-cy='event-details-page'>
      <SplitLeftRight>
        <H1>{event.name}</H1>
        <DangerButton className='mb-3'>  
          Event Löschen
        </DangerButton>
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
          <H2>Administratoren</H2>
          {event.eventAdmins.map(ea => (
            <p key={ea.adminId}><b>{ea.admin.name}</b>: {ea.admin.email}</p>
          ))}
        </Box>
      </SpaceY>

      {/* Delete Modal */}
      <div className=' fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center'>
        <div className='bg-stone-900 px-5 py-3 rounded-lg max-w-md'>
          <div className='flex justify-between items-center mb-3'>
            <h4 className='text-red-400 text-2xl'>Bestätige Löschen?</h4>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className='mb-3'>
            <p>Bist du sicher, dass du <i>"{event.name}"</i> unwiederruflich löschen möchtest?"</p>
          </div>
          <div className='flex justify-end items-center'>
            <Button color='stone' className='mr-3'>
              Abbrechen
            </Button>
            <DangerButton>
              Löschen
            </DangerButton>
          </div>
        </div>
      </div>
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