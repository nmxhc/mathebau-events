import type { FC } from 'react'


export const PageWrapper:FC = ({children}) => {
  return (
    <div className=' bg-black min-h-full text-stone-100 flex flex-col'>{children}</div>
  )
}
