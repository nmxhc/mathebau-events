import type { ChangeEventHandler, FC} from 'react';
import { useRef } from 'react'
import { SideToSide } from '~/components/elementary/SideToSide'
import type { ActionData } from '~/utils/forms/validation';
import { dateToString, theDayBefore, updateDateRangeOfDateInputElement } from '~/utils/dates'
import { CostInput } from './inputs/CostInput'
import { DescriptionInput } from './inputs/DescriptionInput'
import { EndDateInput } from './inputs/EndDateInput'
import { EventNameInput } from './inputs/EventNameInput'
import { LocationInput } from './inputs/LocationInput'
import { ParticipantsLimitInput } from './inputs/ParticipantsLimitInput'
import { SignupEndDateInput } from './inputs/SignupEndDateInput'
import { SignupStartDateInput } from './inputs/SignupStartDateInput'
import { StartDateInput } from './inputs/StartDateInput'
import type { Event } from '@prisma/client';

type DefaultValues = Event & {[key: string] : any}

export const EventDataInputs:FC<ActionData & {costInputChanged?:ChangeEventHandler<HTMLInputElement>, defaultValues?: DefaultValues }> = ({errors, formDataForRefill, costInputChanged, defaultValues}) => {
  // Won't Do: use formDataForRefill to refill the form by setting the defaultValue of the input elements. Because Only needed for users with JavaScript disabled.

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
    <>
      <EventNameInput
        errorMessage={errors?.eventName}
        defaultValue={defaultValues?.name}
      />

      <SideToSide
        left={
          <StartDateInput
            errorMessage={errors?.startDate}
            onChange={startDateChanged}
            inputElementRef={startDateInput}
            defaultValue={ (defaultValues && defaultValues.startDate) ? dateToString(new Date(defaultValues.startDate)) : undefined}
          />
        }
        right={
          <EndDateInput
            errorMessage={errors?.endDate}
            inputElementRef={endDateInput}
            defaultValue={ (defaultValues && defaultValues.endDate) ? dateToString(new Date(defaultValues.endDate)) : undefined}
          />
        }
      />

      <LocationInput
        errorMessage={errors?.location}
        defaultValue={defaultValues?.location}
      />

      <DescriptionInput
        errorMessage={errors?.description}
        defaultValue={defaultValues?.description}
      />

      <SideToSide
        left={
          <SignupStartDateInput
            errorMessage={errors?.signupStartDate}
            onChange={signupStartDateChanged}
            inputElementRef={signupStartDateInput}
            defaultValue={ (defaultValues && defaultValues.signupStartDate) ? dateToString(new Date(defaultValues.signupStartDate)) : undefined}
          />
        }
        right={
          <SignupEndDateInput
            errorMessage={errors?.signupEndDate}
            inputElementRef={signupEndDateInput}
            defaultValue={ (defaultValues && defaultValues.signupEndDate) ? dateToString(new Date(defaultValues.signupEndDate)) : undefined}
          />
        }
      />

      <SideToSide
        left={
          <ParticipantsLimitInput
            errorMessage={errors?.participantsLimit}
            defaultValue={'' + defaultValues?.participantsLimit || '0'}
          />
        }
        right={
          <CostInput
            errorMessage={errors?.cost}
            onChange={costInputChanged}
            defaultValue={ (defaultValues && defaultValues.cost)? defaultValues.cost : ''}
          />
        }
      />
    </>
  )
}
