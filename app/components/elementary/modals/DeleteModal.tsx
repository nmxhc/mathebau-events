/* eslint-disable react/display-name */
import { Form } from '@remix-run/react'
import type { FC, ReactNode} from 'react';
import { Button } from '~/components/elementary/Button'
import { Modal } from './Modal';

export const DeleteModal:FC<{children?: ReactNode, isShown: boolean, closeModal: () => void}> = ({children, isShown, closeModal}) => {

  return (
    <Modal
      isShown={isShown}
      closeModal={closeModal}
      title={
        <h4 className='text-red-400 text-2xl'>Bestätige Löschen?</h4>
      }
      text={children}
      bottom={
        <div className='flex justify-end items-center'>
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
      }
    />
  )
}
