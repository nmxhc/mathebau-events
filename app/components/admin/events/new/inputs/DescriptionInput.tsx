import type { FC } from 'react'
import type { TextAreaWithLabelAndErrorMessageProps } from '~/components/forms/TextAreaWithLabelAndErrorMessage';
import { TextAreaWithLabelAndErrorMessage } from '~/components/forms/TextAreaWithLabelAndErrorMessage';

export const DescriptionInput:FC<
  Pick<TextAreaWithLabelAndErrorMessageProps, 'errorMessage'|'defaultValue'>
> = ({errorMessage, defaultValue}) => {
  return (
    <TextAreaWithLabelAndErrorMessage
      name="description"
      label="Beschreibung"
      rows={4}
      defaultValue={defaultValue}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}