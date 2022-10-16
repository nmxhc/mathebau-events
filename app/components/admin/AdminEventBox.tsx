import { Link } from '@remix-run/react'
import moment from 'moment'
import type { FC } from 'react'
import type { getAdminEvents } from '~/models/event.server'
import type { ArrayElement } from '~/utils'
import { Box } from '../elementary/Box'
import { EventSignupInfo } from './events/EventSignupInfo'
export const AdminEventBox:FC<{event: ArrayElement<NonNullable<Awaited<ReturnType<typeof getAdminEvents>>>>}> = ({event}) => {
  return (
    <Box data-cy={`${event.name.replace(/\s/g , "-")}-box`}>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl text-lime-200'>{event.name}</h2>
        <Link to={`/admin/events/${event.id}`}>
          <button  className='px-4 py-2 bg-lime-600 text-lime-50 rounded-md hover:bg-lime-700 transition duration-200 ease-in-out'>
            <b>Event Details</b>
          </button>
        </Link>
      </div>
      <div className='flex flex-col-reverse sm:flex-row justify-between'>
        <div>
          <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {event.endDate && `bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
          <p><b>Wo?</b> {event.location}</p>
        </div>
        <div>
          <EventSignupInfo event={event} />
          <p><b>Teilnehmer:</b> {event.signups.length}{event.participantsLimit && `/${event.participantsLimit}`} </p>
        </div>
      </div>
    </Box>
  )
}
