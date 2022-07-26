import { Link } from '@remix-run/react'
import moment from 'moment'
import type { FC } from 'react'
import type { Event } from '~/models/event.server'
import { Box } from '../elementary/Box'
export const AdminEventBox:FC<{event: Event}> = ({event}) => {
  return (
    <Box>
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
          { new Date(event.signupStartDate) > new Date() && (
            <p className='text-blue-200'>
              Anmeldezeitraum beginnt in {moment(event.signupStartDate).diff(moment(), 'days')} Tagen
            </p>
          )}
          { new Date(event.signupStartDate) < new Date() && new Date() < new Date(event.signupEndDate) && (
          <p className='text-lime-200'>
            Anmeldungen laufen bis zum {moment(event.signupEndDate).format('DD.MM.YYYY')}
          </p>)}
          { new Date(event.signupEndDate) < new Date() && new Date() < new Date(event.startDate) && (
          <p className='text-amber-200'>
            Der Anmeldezeitraum ist vorbei!
          </p>)}
          { new Date(event.startDate) < new Date() && new Date() < new Date(event.endDate) && (
          <p className='text-lime-400'>
            Das Event Läuft
          </p>)}
          { new Date(event.endDate) < new Date() && (
          <p className='text-stone-300'>
            Das Event ist vorbei
          </p>)}
          <p><b>Teilnehmer:</b> XX{event.participantsLimit && `/${event.participantsLimit}`} </p>
        </div>
      </div>
    </Box>
  )
}
