import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const EventNameInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'>
> = ({errorMessage}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="text"
      name="eventName"
      label="Name des Events"
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}
