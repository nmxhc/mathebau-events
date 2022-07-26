import type { FC} from 'react';
import { useRef } from 'react'
import { Box } from '~/components/elementary/Box'
import { H2 } from '~/components/elementary/H2'
import { SideToSide } from '~/components/elementary/SideToSide'
import { SpaceY } from '~/components/elementary/SpaceY'
import type { ActionDataOfNewEvent } from '~/routes/admin/events/new'
import { theDayBefore, updateDateRangeOfDateInputElement } from '~/utils/dates'
import { CostInput } from './inputs/CostInput'
import { DescriptionInput } from './inputs/DescriptionInput'
import { EndDateInput } from './inputs/EndDateInput'
import { EventNameInput } from './inputs/EventNameInput'
import { LocationInput } from './inputs/LocationInput'
import { ParticipantsLimitInput } from './inputs/ParticipantsLimitInput'
import { SignupEndDateInput } from './inputs/SignupEndDateInput'
import { SignupStartDateInput } from './inputs/SignupStartDateInput'
import { StartDateInput } from './inputs/StartDateInput'

export const EventDataInputBox:FC<{errors: ActionDataOfNewEvent['errors']}> = ({errors}) => {

  const startDateInput = useRef<HTMLInputElement>(null);
  const endDateInput = useRef<HTMLInputElement>(null);
  const signupStartDateInput = useRef<HTMLInputElement>(null);
  const signupEndDateInput = useRef<HTMLInputElement>(null);

  const startDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;

    updateDateRangeOfDateInputElement(endDateInput, {min:newStartDate});
    updateDateRangeOfDateInputElement(signupEndDateInput, {max:theDayBefore(newStartDate)});
    updateDateRangeOfDateInputElement(signupStartDateInput, {max:theDayBefore(newStartDate)});
  }

  const signupStartDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSignupStartDate = e.target.value;

    updateDateRangeOfDateInputElement(signupEndDateInput, {min:newSignupStartDate});
  }

  return (
    <Box>
    <SpaceY>
      <H2>Eventdaten</H2>

      <EventNameInput
        errorMessage={errors?.eventName}
      />

      <SideToSide
        left={
          <StartDateInput
            errorMessage={errors?.startDate}
            onChange={startDateChanged}
            inputElementRef={startDateInput}
          />
        }
        right={
          <EndDateInput
            errorMessage={errors?.endDate}
            inputElementRef={endDateInput}
          />
        }
      />

      <LocationInput
        errorMessage={errors?.location}
      />

      <DescriptionInput
        errorMessage={errors?.description}
      />

      <SideToSide
        left={
          <SignupStartDateInput
            errorMessage={errors?.signupStartDate}
            onChange={signupStartDateChanged}
            inputElementRef={signupStartDateInput}
          />
        }
        right={
          <SignupEndDateInput
            errorMessage={errors?.signupEndDate}
            inputElementRef={signupEndDateInput}
          />
        }
      />

      <SideToSide
        left={
          <ParticipantsLimitInput
            errorMessage={errors?.participantsLimit}
          />
        }
        right={
          <CostInput
            errorMessage={errors?.cost}
          />
        }
      />
    </SpaceY>
    </Box>
  )
}
