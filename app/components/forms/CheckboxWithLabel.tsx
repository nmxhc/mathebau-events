import type { FC } from 'react'
import type { CheckboxProps } from './inputs/Checkbox';
import { Checkbox } from './inputs/Checkbox'
import { InputError } from './inputs/InputError'
import { InputLabel } from './inputs/InputLabel'
import { InputWrapper } from './inputs/InputWrapper'

export interface CheckboxWithLabelProps extends CheckboxProps {
  label?: string;
}

export const CheckboxWithLabel:FC<CheckboxWithLabelProps> = ({
  name,
  label,
  inputElementRef,
  defaultValue,
  onChange,
}) => {
  return (
    <div className='flex items-center'>
      <InputLabel htmlFor={name}>
        {label}
      </InputLabel>
      <Checkbox
        inputElementRef={inputElementRef}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  )
}