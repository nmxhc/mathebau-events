import type { FC, ReactNode } from 'react'

export const SideToSide:FC<{left:ReactNode, right:ReactNode}> = ({left, right}) => {
  return (
    <div className='flex'>
      <div className='flex-grow mr-3'>
        {left}
      </div>
      <div className='flex-grow'>
        {right}
      </div>
    </div>
  )
}
