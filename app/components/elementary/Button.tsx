import type { FC, MouseEventHandler } from 'react'

export const Button:FC<{className?: string, color?:string, type?:"submit"|"button"|"reset", onClick?:MouseEventHandler<HTMLButtonElement>, dataCy?:string}> = ({children, className, color, type, onClick, dataCy}) => {
  return (
    <button
      data-cy={dataCy}
      className={`${className} px-4 py-2 bg-${color}-600 text-${color}-50 rounded-md hover:bg-${color}-700 transition duration-200 ease-in-out`}
      type={type}
      onClick={onClick || (() => {})}
    >  
      {children}
    </button>
  )
}