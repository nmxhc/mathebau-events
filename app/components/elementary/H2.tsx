import type { FC } from 'react'


export const H2:FC = ({children}) => {
  return (
    <h2 className='text-2xl text-lime-200'>{children}</h2>
  )
}