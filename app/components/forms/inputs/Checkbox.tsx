import type {FC} from 'react'
import type { UserInputComponentProps } from './types';

export interface CheckboxProps extends UserInputComponentProps<HTMLInputElement> {
}

export const Checkbox:FC<CheckboxProps> = ({
  inputElementRef,
  name,
  defaultValue,
  onChange,
}) => {
  return (
    <input
      type="checkbox"
      ref={inputElementRef}
      id={name}
      name={name}
      value={name}
      defaultValue={defaultValue}
      onChange={onChange || (() => {})}
      autoComplete={name}
      className="rounded border border-stone-500 ml-3 h-5 w-5 text-lg text-stone-700"
    />
  )
}