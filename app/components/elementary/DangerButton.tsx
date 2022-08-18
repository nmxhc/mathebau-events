import type { FC } from 'react'
import { Button } from './Button'

export const DangerButton:FC<{className?: string}> = ({children, className}) => {
  return (
    <Button className={className} color='red'>  
      {children}
    </Button>
  )
}
