/* eslint-disable react/display-name */
import { Form } from '@remix-run/react'
import { forwardRef, useImperativeHandle} from 'react';
import { useRef } from 'react'
import { SpaceY } from '~/components/elementary/SpaceY';
import { CloseCross } from '~/components/elementary/svg/CloseCross';
import { labelOfFieldIds } from './SelectedCustomFields';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SelectWithLabelAndErrorMessage } from '~/components/forms/SelectWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { TextAreaWithLabelAndErrorMessage } from '~/components/forms/TextAreaWithLabelAndErrorMessage';

export type CreateCustomFieldModalHandle = {
  toggleModal: () => void
}

export const CreateCustomFieldModal = forwardRef((props, ref) => {

  const modal = useRef<HTMLDivElement>(null);

  const toggleModal = () => {
    if (modal.current) {
      modal.current.classList.toggle('hidden')
      modal.current.classList.toggle('flex')
    }
  }

  useImperativeHandle(ref, () => ({
    toggleModal
  }));

  const optionsInputRef = useRef<HTMLDivElement>(null);

  const handleFieldTypeChange = (fieldType: string) => {
    if (fieldType === 'select') {
      optionsInputRef.current?.classList.remove('hidden')
    } else {
      optionsInputRef.current?.classList.add('hidden')
    }
  }

  return (
    <div data-cy='create-custom-fields-modal' className='hidden fixed inset-0 bg-black bg-opacity-70 justify-center items-center' ref={modal}>
      <div className='bg-stone-900 px-5 py-3 rounded-lg max-w-md'>
        <div className='flex justify-between items-center mb-3'>
          <h4 className='text-lime-400 text-2xl'>Neues Abfragefeld Erstellen</h4>
          <CloseCross onClick={toggleModal} />
        </div>
        <Form method='post' onSubmit={toggleModal}>
        <SpaceY>
          <InputWithLabelAndErrorMessage
            type='text'
            name='input-name'
            label='Name'
          />
          <SelectWithLabelAndErrorMessage
            name='field-type'
            label='Abfrage-Typ'
            onChange={(e) => handleFieldTypeChange(e.target.value)}>
            {['text','number','checkbox','select'].map((customFieldType) => (
              <option key={customFieldType} value={customFieldType}>
                {/* @ts-ignore */}
                {labelOfFieldIds[customFieldType]}
              </option>
            ))}
          </SelectWithLabelAndErrorMessage>
          <div ref={optionsInputRef} className='hidden' >
            <TextAreaWithLabelAndErrorMessage
              name='select-options'
              label='Optionen (durch Komma getrennt)'
            />
          </div>
          <SubmitButton>Erstellen</SubmitButton>
        <input type='hidden' name='action' value='create-custom-field' />
        </SpaceY>
        </Form>
      </div>
    </div>
  )
})
