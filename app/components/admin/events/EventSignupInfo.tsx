import moment from 'moment'
import type { FC } from 'react'
import type { Event } from '~/models/event.server'
import { getTodayDateString } from '~/utils/dates'

export const EventSignupInfo:FC<{event: Event}> = ({event}) => {
  return (
    <>
      { new Date(event.signupStartDate) > new Date(getTodayDateString()) && (
        <p data-cy='signup-start-info' className='text-blue-200'>
          Die Anmeldung beginnt in {moment(event.signupStartDate).diff(moment(getTodayDateString()), 'days')} Tagen
        </p>
      )}
      { !(new Date(event.signupStartDate) > new Date(getTodayDateString())) && !(new Date(getTodayDateString()) > new Date(event.signupEndDate)) && (
        <p data-cy='signup-ongoing-info' className='text-lime-200'>
          Anmeldungen sind möglich bis inklusive {moment(event.signupEndDate).format('DD.MM.YYYY')}
        </p>
      )}
      { new Date(event.signupEndDate) < new Date(getTodayDateString()) && new Date(getTodayDateString()) < new Date(event.startDate) && (
        <p data-cy='signup-ended-info' className='text-amber-200'>
          Der Anmeldezeitraum ist vorbei!
        </p>
      )}
      { !(new Date(event.startDate) > new Date(getTodayDateString())) && !(new Date(getTodayDateString()) > new Date(event.endDate)) && (
        <p data-cy='event-ongoing-info' className='text-lime-400'>
          Das Event Läuft
        </p>
      )}
      { new Date(event.endDate) < new Date(getTodayDateString()) && (
        <p data-cy='event-ended-info' className='text-stone-300'>
          Das Event ist vorbei
        </p>
      )}
    </>
  )
}
