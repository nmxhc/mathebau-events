import type { FC } from 'react';
import { Modal } from './Modal';

export const FormModal:FC<{title: string, isShown: boolean, closeModal: () => void}> = ({children, title, isShown, closeModal}) => {

  return (
    <Modal
      isShown={isShown}
      closeModal={closeModal}
      title={
        <h4 className='text-lime-400 text-2xl'>{title}</h4>
      }
    >
      {children}
    </Modal>
  )
}