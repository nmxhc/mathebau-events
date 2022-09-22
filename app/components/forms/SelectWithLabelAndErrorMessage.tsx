import type { FC } from 'react'
import type { SelectProps } from './inputs/Select';
import { Select } from './inputs/Select'
import { InputError } from './inputs/InputError'
import { InputLabel } from './inputs/InputLabel'
import { InputWrapper } from './inputs/InputWrapper'

export interface SelectWithLabelAndErrorMessageProps extends SelectProps {
  errorMessage?: string;
  label?: string;
}

export const SelectWithLabelAndErrorMessage:FC<SelectWithLabelAndErrorMessageProps> = ({
  children,
  name,
  label,
  invalid,
  inputElementRef,
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
        <Select
          inputElementRef={inputElementRef}
          name={name}
          invalid={invalid}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          {children}
        </Select>
        {invalid && (
          <InputError errorFor={name}>
            {errorMessage || 'Ungültige Eingabe'}
          </InputError>
        )}
      </InputWrapper>
    </div>
  )
}
