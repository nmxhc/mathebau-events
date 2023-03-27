import { Form } from '@remix-run/react'
import type { FC } from 'react';
import { Button } from '~/components/elementary/Button'
import { Modal } from './Modal';

export const DeleteModal:FC<{isShown: boolean, closeModal: () => void}> = ({children, isShown, closeModal}) => {

  return (
    <Modal
      isShown={isShown}
      closeModal={closeModal}
      title={
        <h4 className='text-red-400 text-2xl'>Bestätige Löschen?</h4>
      }
    >
      <div>
        {children}
      </div>
      <div className='flex justify-end items-center mt-3'>
        <Button dataCy='delete-modal-cancel-button' color='stone' className='mr-3' onClick={closeModal}>
          Abbrechen
        </Button>
        <Form method='post'>
          <Button dataCy='delete-modal-confirm-button' color='red' type='submit'>
            Löschen
          </Button>
          <input type='hidden' name='action' value='delete' />
        </Form>
      </div>
    </Modal>
  )
}
