import type { FC } from 'react'


export const H2:FC<{className?:string}> = ({children, className}) => {
  return (
    <h2 className={`text-2xl text-lime-200 ${className}`}>{children}</h2>
  )
}