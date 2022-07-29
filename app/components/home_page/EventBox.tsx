import moment from 'moment'
import type { FC } from 'react'
import type { Event } from '~/models/event.server'
import { Box } from '../elementary/Box'
import { H2 } from '../elementary/H2'
export const EventBox:FC<{event: Event}> = ({event}) => {
  return (
    <Box>
      <H2>{event.name}</H2>
      <p><b>Wann?</b> {moment(event.startDate).format('DD.MM.YYYY')} {event.endDate && `bis ${moment(event.endDate).format('DD.MM.YYYY')}`}</p>
      <p><b>Wo?</b> {event.location}</p>
      <p><b>Was?</b> {event.description}</p>
      { event.cost && <p><b>Kosten:</b> {event.cost}</p> }
    </Box>
  )
}
