import type { FC, MouseEventHandler } from 'react'

export const CloseCross:FC<{onClick?:MouseEventHandler<SVGSVGElement>}> = ({onClick}) => {
  return (
    <svg data-cy='delete-event-modal-close-button' xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 p-2 cursor-pointer hover:bg-stone-800 rounded-lg transition duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
