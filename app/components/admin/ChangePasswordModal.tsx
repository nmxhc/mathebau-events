/* eslint-disable react/display-name */
import { Form } from '@remix-run/react';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import type { ActionData } from '~/utils/forms/validation';
import { SpaceY } from '../elementary/SpaceY';
import { CloseCross } from '../elementary/svg/CloseCross';
import { InputWithLabelAndErrorMessage } from '../forms/InputWithLabelAndErrorMessage';
import { SubmitButton } from '../forms/SubmitButton';

export const ChangePasswordModal = forwardRef(({actionData}:{actionData?:ActionData}, ref) => {

  const modal = useRef<HTMLDivElement>(null);

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
    hideModal,
    showModal
  }));

  return (
    <div data-cy='change-password-modal' className='hidden fixed inset-0 bg-black bg-opacity-70 justify-center items-center' ref={modal}>
      <div className='bg-stone-900 px-5 py-3 rounded-lg w-1/2 '>
        <div className='flex justify-between items-center mb-3 '>
          <h4 className='text-lime-400 text-2xl'>Passwort ändern</h4>
          <CloseCross onClick={hideModal} />
        </div>
        <Form method='post'>
        <SpaceY>
          <InputWithLabelAndErrorMessage
            type='password'
            name='oldPassword'
            label='Altes Passwort'
            invalid={actionData?.errors?.oldPassword !== undefined}
            errorMessage={actionData?.errors?.oldPassword}
          />
          <InputWithLabelAndErrorMessage
            type='password'
            name='newPassword'
            label='Neues Passwort'
            invalid={actionData?.errors?.newPassword !== undefined}
            errorMessage={actionData?.errors?.newPassword}
          />
          <InputWithLabelAndErrorMessage
            type='password'
            name='passwordConfirmation'
            label='Neues Passwort bestätigen'
            invalid={actionData?.errors?.passwordConfirmation !== undefined}
            errorMessage={actionData?.errors?.passwordConfirmation}
          />
          <SubmitButton>Passwort Ändern</SubmitButton>
          <input type='hidden' name='action' value='change-password' />
        </SpaceY>
        </Form>
      </div>
    </div>
  )
})
