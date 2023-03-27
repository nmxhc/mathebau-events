import type { FC } from 'react'
import type { UserInputComponentProps } from './types'

export interface InputProps extends UserInputComponentProps<HTMLInputElement> {
  type: 'text' | 'date' | 'password' | 'email' | 'number';
  min?: number | string;
  max?: number | string;
}

export const Input:FC<InputProps> = ({name, type, invalid, inputElementRef, min, max, defaultValue, onChange}) => {
  return (
    <input
      ref={inputElementRef}
      id={name}
      name={name}
      type={type}
      min={min}
      max={max}
      defaultValue={defaultValue}
      onChange={onChange || (() => {})}
      autoComplete={name}
      aria-invalid={invalid}
      aria-describedby={`${name}-error`}
      className="w-full rounded border border-stone-500 px-2 py-1 text-lg text-stone-700"
    />
  )
}
