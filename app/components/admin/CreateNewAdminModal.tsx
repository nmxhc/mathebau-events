/* eslint-disable react/display-name */
import { Form } from '@remix-run/react'
import { forwardRef, useImperativeHandle} from 'react';
import { useRef } from 'react'
import { SpaceY } from '~/components/elementary/SpaceY';
import { CloseCross } from '~/components/elementary/svg/CloseCross';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import type { ActionData } from '~/utils/forms/validation';

export type CreateNewAdminModalHandle = {
  toggleModal: () => void
  hideModal: () => void
  showModal: () => void
}

export const CreateNewAdminModal = forwardRef(({actionData}:{actionData?:ActionData}, ref) => {

  const modal = useRef<HTMLDivElement>(null);

  const toggleModal = () => {
    if (modal.current) {
      modal.current.classList.toggle('hidden')
      modal.current.classList.toggle('flex')
    }
  }

  const hideModal = () => {
    if (modal.current) {
      modal.current.classList.add('hidden')
      modal.current.classList.remove('flex')
    }
  }

  const showModal = () => {
    if (modal.current) {
      modal.current.classList.remove('hidden')
      modal.current.classList.add('flex')
    }
  }

  useImperativeHandle(ref, () => ({
    toggleModal,
    hideModal,
    showModal
  }));

  return (
    <div data-cy='create-new-admin-modal' className='hidden fixed inset-0 bg-black bg-opacity-70 justify-center items-center' ref={modal}>
      <div className='bg-stone-900 px-5 py-3 rounded-lg w-1/2 '>
        <div className='flex justify-between items-center mb-3 '>
          <h4 className='text-lime-400 text-2xl'>Neuen Admin anlegen</h4>
          <CloseCross onClick={toggleModal} />
        </div>
        <Form method='post'>
        <SpaceY>
          <InputWithLabelAndErrorMessage
            type='text'
            name='newName'
            label='Name'
            invalid={actionData?.errors?.newName !== undefined}
            errorMessage={actionData?.errors?.newName}
          />
          <InputWithLabelAndErrorMessage
            type='email'
            name='newEmail'
            label='E-Mail'
            invalid={actionData?.errors?.newEmail !== undefined}
            errorMessage={actionData?.errors?.newEmail}
          />
          <InputWithLabelAndErrorMessage
            type='password'
            name='newPassword'
            label='Passwort'
            invalid={actionData?.errors?.newPassword !== undefined}
            errorMessage={actionData?.errors?.newPassword}
          />
          <SubmitButton>Erstellen</SubmitButton>
          <input type='hidden' name='action' value='create-new-admin' />
        </SpaceY>
        </Form>
      </div>
    </div>
  )
})
