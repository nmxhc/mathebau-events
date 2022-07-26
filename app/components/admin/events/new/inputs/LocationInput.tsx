import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const LocationInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'>
> = ({errorMessage}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="text"
      name="location"
      label="Veranstaltungsort"
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}