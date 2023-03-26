import type { FC } from 'react'
import type { InputWithLabelAndErrorMessageProps } from '~/components/forms/InputWithLabelAndErrorMessage';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage'

export const CostInput:FC<
  Pick<InputWithLabelAndErrorMessageProps, 'errorMessage'|'onChange'|'defaultValue'>
> = ({errorMessage, onChange, defaultValue}) => {
  return (
    <InputWithLabelAndErrorMessage
      name="cost"
      type="text"
      label="Kosten (optional)"
      invalid={errorMessage !== undefined}
      defaultValue={defaultValue}
      errorMessage={errorMessage}
      onChange={onChange}
    />
  )
}