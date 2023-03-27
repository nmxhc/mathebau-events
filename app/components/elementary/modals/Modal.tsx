import type { FC, ReactNode} from 'react';
import { CloseCross } from '~/components/elementary/svg/CloseCross';

export const Modal:FC<{title: ReactNode, isShown: boolean, closeModal: () => void}> = ({children, title, isShown, closeModal}) => {

  return (
    <div data-cy='modal' className={`${isShown ? 'flex' : 'hidden'} fixed inset-0 bg-black bg-opacity-70 justify-center items-center`}>
      <div className='bg-stone-900 px-5 py-3 rounded-lg max-w-lg'>
        <div className='flex justify-between items-center mb-3'>
          {title}
          <CloseCross onClick={closeModal} />
        </div>
        {children}
      </div>
    </div>
  )
}
