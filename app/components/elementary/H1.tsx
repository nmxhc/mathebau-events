import type { FC } from 'react'


export const H1:FC = ({children}) => {
  return (
    <h1 className='ml-3 sm:ml-0 text-2xl text-lime-400 mb-3'>{children}</h1>
  )
}