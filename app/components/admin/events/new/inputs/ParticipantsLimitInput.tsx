import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const ParticipantsLimitInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'defaultValue'>
> = ({errorMessage, defaultValue}) => {
  return (
    <InputWithLabelAndErrorMessage
      name="participantsLimit"
      type="number"
      label="Teilnehmerlimit (optional)"
      min={0}
      defaultValue={defaultValue}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}