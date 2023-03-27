import { Form } from '@remix-run/react'
import type { FC } from 'react';
import { SpaceY } from '~/components/elementary/SpaceY';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import type { ActionData } from '~/utils/forms/validation';
import { FormModal } from '../elementary/modals/FormModal';

export const CreateNewAdminModal:FC<{isShown: boolean, closeModal: () => void, actionData?: ActionData}> = ({isShown, closeModal, actionData}) => {

  return (
    <FormModal
      title='Neuen Admin Erstellen'
      isShown={isShown}
      closeModal={closeModal}
    >
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
    </FormModal>
  )
}
