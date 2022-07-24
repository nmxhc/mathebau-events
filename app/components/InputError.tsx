import type { FC } from 'react'

export const InputError:FC<{errorFor: string}> = ({children, errorFor}) => {
  return (
    <div className="pt-1 text-red-700" id={`${errorFor}-error`}>
      {children}
    </div>
  )
}
