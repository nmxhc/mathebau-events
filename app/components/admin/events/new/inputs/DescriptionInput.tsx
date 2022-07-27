import type { FC } from 'react'
import type { TextAreaWithLabelAndErrorMessageProps } from '~/components/forms/TextAreaWithLabelAndErrorMessage';
import { TextAreaWithLabelAndErrorMessage } from '~/components/forms/TextAreaWithLabelAndErrorMessage';

export const DescriptionInput:FC<
  Pick<TextAreaWithLabelAndErrorMessageProps, 'errorMessage'>
> = ({errorMessage}) => {
  return (
    <TextAreaWithLabelAndErrorMessage
      name="description"
      label="Beschreibung"
      rows={4}
      invalid={errorMessage !== undefined}
      errorMessage={errorMessage}
    />
  )
}