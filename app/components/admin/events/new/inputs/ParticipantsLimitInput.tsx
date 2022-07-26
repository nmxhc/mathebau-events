import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const ParticipantsLimitInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'>
> = ({errorMessage}) => {
  return (
    <InputWithLabelAndErrorMessage
      name="participantsLimit"
      type="number"
      label="Teilnehmerlimit (optional)"
      min={0}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}