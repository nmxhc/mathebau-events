import { Form } from '@remix-run/react'
import type { FC } from 'react';
import { SpaceY } from '~/components/elementary/SpaceY';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import type { ActionData } from '~/utils/forms/validation';
import { FormModal } from '../elementary/modals/FormModal';

export const ChangePasswordModal:FC<{isShown: boolean, closeModal: () => void, actionData?: ActionData}> = ({isShown, closeModal, actionData}) => {

  return (
    <FormModal
      title='Neuen Admin Erstellen'
      isShown={isShown}
      closeModal={closeModal}
    >
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
          name='newPasswordd'
          label='Neues Passwort'
          invalid={actionData?.errors?.newPasswordd !== undefined}
          errorMessage={actionData?.errors?.newPasswordd}
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
    </FormModal>
  )
}
