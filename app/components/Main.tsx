import type { FC } from 'react'


export const Main:FC = ({children}) => {
  return (
    <main className='bg-stone-900 sm:px-5 pt-3 pb-5 space-y-5 flex-grow w-full max-w-screen-md mx-auto'>{children}</main>
  )
}