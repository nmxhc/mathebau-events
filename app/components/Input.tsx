import type { ChangeEventHandler, FC, LegacyRef, RefObject } from 'react'

export const Input:FC<{name: string, type: 'text'|'date'|'password'|'email'|'number'|'textarea', invalid?: boolean, reference?:RefObject<HTMLInputElement>, areaRef?:LegacyRef<HTMLTextAreaElement>, min?:string, max?:string, defaultValue?:string, rows?:number, onChange?:ChangeEventHandler<HTMLInputElement>, areaOnChange?:ChangeEventHandler<HTMLTextAreaElement>}> = ({name, type, invalid, reference, areaRef, min, max, defaultValue, rows, onChange, areaOnChange}) => {
  if (type === 'textarea') {
    return (
      <textarea
        ref={areaRef}
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        onChange={areaOnChange || (() => {})}
        autoComplete={name}
        aria-invalid={invalid}
        aria-describedby={`${name}-error`}
        className="w-full rounded border border-stone-500 px-2 py-1 text-lg text-stone-700"
      />
    )
  }
  return (
    <input
      ref={reference}
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
