import type {FC} from 'react'
import type { UserInputComponentProps } from './types';

export interface TextAreaProps extends UserInputComponentProps<HTMLTextAreaElement> {
  rows?: number;
}

export const TextArea:FC<TextAreaProps> = ({
  inputElementRef,
  name,
  defaultValue,
  rows,
  onChange,
  invalid,
}) => {
  return (
    <textarea
      ref={inputElementRef}
      id={name}
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      onChange={onChange || (() => {})}
      autoComplete={name}
      aria-invalid={invalid}
      aria-describedby={`${name}-error`}
      className="w-full rounded border border-stone-500 px-2 py-1 text-lg text-stone-700"
    />
  )
}
