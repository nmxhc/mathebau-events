import type { FC } from 'react';
import type { CustomField } from '~/routes/admin/events/new'

const AddCustomFieldSelectOptions:FC<{availableCustomFields: CustomField[], customFields: CustomField[]}> = ({availableCustomFields, customFields}) => {
  return (
    <>
      {
        availableCustomFields.filter(
          (availableCustomField) => customFields.findIndex(
            (customField) => customField.id === availableCustomField.id
          ) === -1
        ).map((customField) => (
          <option key={customField.id} value={customField.id} className='bg-white text-stone-700'>
            {customField.name}
          </option>
        ))
      }
    </>
  )
}

export default AddCustomFieldSelectOptions