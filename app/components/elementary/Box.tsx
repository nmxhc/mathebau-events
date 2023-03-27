import type { FC } from 'react'


export const Box:FC<{'data-cy'?:string}> = (props) => {
  return (
    <div data-cy={props['data-cy']} className='px-3 py-3 bg-stone-800 sm:rounded-md'>{props.children}</div>
  )
}