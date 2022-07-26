import type { FC } from 'react'

export const InputError:FC<{errorFor: string}> = ({children, errorFor}) => {
  return (
    <div className="pt-1 text-red-500" id={`${errorFor}-error`}>
      {children}
    </div>
  )
}
