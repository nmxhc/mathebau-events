import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const CostInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'onChange'>
> = ({errorMessage, onChange}) => {
  return (
    <InputWithLabelAndErrorMessage
      name="cost"
      type="text"
      label="Kosten (optional)"
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
      onChange={onChange}
    />
  )
}