import type {FC} from 'react'
import type { UserInputComponentProps } from './types';

export interface SelectProps extends UserInputComponentProps<HTMLSelectElement> {
  
}

export const Select:FC<SelectProps> = ({
  children,
  inputElementRef,
  name,
  defaultValue,
  onChange,
  invalid,
  className,
}) => {
  return (
    <select
      ref={inputElementRef}
      id={name}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange || (() => {})}
      autoComplete={name}
      aria-invalid={invalid}
      aria-describedby={`${name}-error`}
      className={`w-full rounded border border-stone-500 px-2 py-1 text-lg text-stone-700 ${className}`}
    >
      {children}
    </select>
  )
}
