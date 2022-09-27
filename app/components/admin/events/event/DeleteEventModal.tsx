/* eslint-disable react/display-name */
import { Form } from '@remix-run/react'
import type { MouseEventHandler} from 'react';
import { forwardRef, useImperativeHandle} from 'react';
import { useRef } from 'react'
import { Button } from '~/components/elementary/Button'
import { CloseCross } from '~/components/elementary/svg/CloseCross';

export type DeleteEventModalHandle = {
  toggleModal: () => void
}

export const DeleteEventModal = forwardRef(({eventName}:{eventName:string}, ref) => {

  const modal = useRef<HTMLDivElement>(null);

  const toggleModal:MouseEventHandler = () => {
    if (modal.current) {
      modal.current.classList.toggle('hidden')
      modal.current.classList.toggle('flex')
    }
  }

  useImperativeHandle(ref, () => ({
    toggleModal
  }));

  return (
    <div data-cy='delete-event-modal' ref={modal} className='hidden fixed inset-0 bg-black bg-opacity-70 justify-center items-center'>
      <div className='bg-stone-900 px-5 py-3 rounded-lg max-w-sm'>
        <div className='flex justify-between items-center mb-3'>
          <h4 className='text-red-400 text-2xl'>Bestätige Löschen?</h4>
          <CloseCross onClick={toggleModal} />
        </div>
        <div className='mb-3'>
          <p>Bist du sicher, dass du <i>"{eventName}"</i> unwiederruflich löschen möchtest?"</p>
        </div>
        <div className='flex justify-end items-center'>
          <Button dataCy='delete-event-modal-cancel-button' color='stone' className='mr-3' onClick={toggleModal}>
            Abbrechen
          </Button>
          <Form method='post'>
            <Button dataCy='delete-event-modal-confirm-button' color='red' type='submit'>
              Löschen
            </Button>
            <input type='hidden' name='action' value='delete-event' />
          </Form>
        </div>
      </div>
    </div>
  )
})
