import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'
import { getTomorrowDateString } from '~/utils/dates';

export const StartDateInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'inputElementRef'|'onChange'| 'defaultValue'>
> = ({errorMessage, inputElementRef, onChange, defaultValue}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="date"
      name="startDate"
      label="Startdatum"
      min={getTomorrowDateString()}
      inputElementRef={inputElementRef}
      onChange={onChange}
      defaultValue={defaultValue}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}