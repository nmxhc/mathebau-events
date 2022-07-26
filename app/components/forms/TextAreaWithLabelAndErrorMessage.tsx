import type { FC } from 'react'
import type { TextAreaProps } from './inputs/TextArea';
import { TextArea } from './inputs/TextArea'
import { InputError } from './inputs/InputError'
import { InputLabel } from './inputs/InputLabel'
import { InputWrapper } from './inputs/InputWrapper'

export interface TextAreaWithLabelAndErrorMessageProps extends TextAreaProps {
  errorMessage?: string;
  label?: string;
}

export const TextAreaWithLabelAndErrorMessage:FC<TextAreaWithLabelAndErrorMessageProps> = ({
  name,
  label,
  invalid,
  inputElementRef,
  rows,
  defaultValue,
  onChange,
  errorMessage
}) => {
  return (
    <div>
      <InputLabel htmlFor={name}>
        {label}
      </InputLabel>
      <InputWrapper>
        <TextArea
          inputElementRef={inputElementRef}
          name={name}
          invalid={invalid}
          rows={rows}
          defaultValue={defaultValue}
          onChange={onChange}
        />
        {invalid && (
          <InputError errorFor={name}>
            {errorMessage || 'Ungültige Eingabe'}
          </InputError>
        )}
      </InputWrapper>
    </div>
  )
}
