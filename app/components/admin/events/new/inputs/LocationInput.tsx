import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const LocationInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'defaultValue'>
> = ({errorMessage, defaultValue}) => {
  return (
    <InputWithLabelAndErrorMessage
      type="text"
      name="location"
      label="Veranstaltungsort"
      defaultValue={defaultValue}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}