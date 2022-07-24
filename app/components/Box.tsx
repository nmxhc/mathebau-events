import type { FC } from 'react'


export const Box:FC = ({children}) => {
  return (
    <div className='px-3 py-3 bg-stone-800 sm:rounded-md'>{children}</div>
  )
}