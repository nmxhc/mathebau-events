import type { FC } from 'react'
import type { InputProps } from './inputs/Input';
import { Input } from './inputs/Input'
import { InputError } from './inputs/InputError'
import { InputLabel } from './inputs/InputLabel'
import { InputWrapper } from './inputs/InputWrapper'

export interface InputWithLabelAndErrorMessageProps extends InputProps {
  errorMessage?: string;
  label?: string;
}

export const InputWithLabelAndErrorMessage:FC<InputWithLabelAndErrorMessageProps> = ({
  name,
  type,
  label,
  invalid,
  inputElementRef,
  min,
  max,
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
        <Input
          inputElementRef={inputElementRef}
          name={name}
          type={type}
          invalid={invalid}
          min={min}
          max={max}
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
