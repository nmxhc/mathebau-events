import type { FC } from 'react'

export const SubBox:FC<{'data-cy'?:string}> = (props) => {
  return (
    <div data-cy={props['data-cy']} className='px-4 py-2 bg-stone-700 text-white rounded-md'>{props.children}</div>
  )
}