import type { FC } from 'react'

export const InputLabel:FC<{htmlFor: string}> = ({children, htmlFor}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-stone-100"
    >
      {children}
    </label>
  )
}
