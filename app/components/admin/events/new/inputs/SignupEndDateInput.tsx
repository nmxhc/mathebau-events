import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'
import { getTodayDateString } from '~/utils/dates';

export const SignupEndDateInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'inputElementRef'>
> = ({errorMessage, inputElementRef}) => {
  return (
    <InputWithLabelAndErrorMessage
      name="signupEndDate"
      type="date"
      label="Anmeldeschluss"
      min={getTodayDateString()}
      inputElementRef={inputElementRef}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}