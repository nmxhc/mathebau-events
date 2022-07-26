import type { FC } from 'react'


export const SplitLeftRight:FC = ({children}) => {
  return (
    <div className='flex justify-between items-center'>{children}</div>
  )
}