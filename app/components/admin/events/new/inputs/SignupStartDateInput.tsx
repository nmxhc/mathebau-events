import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'
import { getTodayDateString } from '~/utils/dates';

export const SignupStartDateInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'inputElementRef'|'onChange'|'defaultValue'>
> = ({errorMessage, inputElementRef, onChange, defaultValue}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="date"
      name="signupStartDate"
      label="Anmeldestart"
      min={getTodayDateString()}
      defaultValue={getTodayDateString()}
      inputElementRef={inputElementRef}
      onChange={onChange}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}