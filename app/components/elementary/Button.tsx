import type { FC } from 'react'

export const Button:FC<{className?: string, color?:string}> = ({children, className, color}) => {
  return (
    <button className={`${className} px-4 py-2 bg-${color}-600 text-${color}-50 rounded-md hover:bg-${color}-700 transition duration-200 ease-in-out`}>  
      {children}
    </button>
  )
}