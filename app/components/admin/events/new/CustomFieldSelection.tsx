import type { FC, RefObject } from 'react';
import React from 'react'
import { Select } from '~/components/forms/inputs/Select'
import type { CustomField } from '~/routes/admin/events/new'
import AddCustomFieldSelectOptions from './AddCustomFieldSelectOptions'

export const CustomFieldSelection:FC<{availableCustomFields:CustomField[], customFields:CustomField[], onChange: (fieldId: string) => any, addFieldSelectElementRef:RefObject<HTMLSelectElement>}> = ({ availableCustomFields, customFields, onChange, addFieldSelectElementRef }) => {
  return (
    <Select name='newCustomField' className='bg-lime-600 text-lime-50 mt-3' inputElementRef={addFieldSelectElementRef}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value='add-field' className='bg-white text-stone-400'>Feld zu Event hinzufügen</option>
      <option value='create-new-field' className='bg-lime-600 text-lime-50'>Neues Feld erstellen</option>
      <AddCustomFieldSelectOptions
        availableCustomFields={availableCustomFields.filter( f => !f.adminOnly)}
        customFields={customFields}
      />
    </Select>
  )
}
