import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'
import { getTomorrowDateString } from '~/utils/dates';

export const EndDateInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'inputElementRef'>
> = ({errorMessage, inputElementRef}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="date"
      name="endDate"
      label="Enddatum"
      min={getTomorrowDateString()}
      inputElementRef={inputElementRef}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}