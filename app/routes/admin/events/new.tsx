import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { Box } from '~/components/elementary/Box';
import { H1 } from '~/components/elementary/H1';
import { requireAdminId } from '~/session_admin.server';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { SpaceY } from '~/components/elementary/SpaceY';
import { EventDataInputBox } from '~/components/admin/events/new/EventDataInputBox';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import type { ActionData} from '~/utils/forms/validation';
import { validateAndParseFormData} from '~/utils/forms/validation';
import { errorResponse} from '~/utils/forms/validation';
import { newEventFormValidationSchema } from '~/utils/forms/new-event';
import type { createEventArguments } from '~/models/event.server';
import { createEvent } from '~/models/event.server';
import { H2 } from '~/components/elementary/H2';
import { useRef, useState } from 'react';
import { getCustomFields } from '~/models/custom-fields.server';
import type { ArrayElement } from '~/utils';
import { Select } from '~/components/forms/inputs/Select';
import AddCustomFieldSelectOptions from '~/components/admin/events/new/AddCustomFieldSelectOptions';

export type CustomField = ArrayElement<NonNullable<Awaited<ReturnType<typeof getCustomFields>>>>

type LoaderData = {
  availableCustomFields: CustomField[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminId(request);
  const availableCustomFields = await getCustomFields()
  return json({ availableCustomFields });
}

export const action: ActionFunction = async ({ request }) => {
  const adminId = await requireAdminId(request);
  const formData = await request.formData();
  const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, newEventFormValidationSchema);

  if (errors) {
    return errorResponse(errors, formDataForRefill);
  }

  const event = await createEvent({
    event: parsedData as createEventArguments['event'],
    adminId
  });

  return redirect(`/admin/events/${event.id}`);
}


export default function NewEventPage() {

  const actionData = useActionData() as ActionData;
  const { availableCustomFields } = useLoaderData() as LoaderData;

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const addFieldSelectElementRef = useRef<HTMLSelectElement>(null);

  const addField = (fieldId: string) => {
    addFieldSelectElementRef.current!.value = 'add-field';
    const field = availableCustomFields.find(field => field.id === fieldId);
    if (field) {
      setCustomFields([...customFields, field]);
    }
  }

  const removeField = (fieldId: string) => {
    const field = customFields.find(field => field.id === fieldId);
    if (field) {
      setCustomFields(customFields.filter(field => field.id !== fieldId));
    }
  }

  const labelOfFieldIds = {
    text: 'Textfeld',
    number: 'Zahlenfeld',
    select: 'Auswahlfeld',
    checkbox: 'Checkbox'
  }

  return (
    <div data-cy='new-event-page'>
      <SplitLeftRight>
        <H1>Erstelle ein neues Event</H1>
        <Link to='/admin/events'><span className='text-blue-300'>Zurück</span></Link>
      </SplitLeftRight>

      <Form method="post">
      <SpaceY>
        <EventDataInputBox
          errors={actionData?.errors}
          formDataForRefill={actionData?.formDataForRefill}
        />

        <Box>
          <H2>Abfragefelder</H2>
          <div className='mt-3 space-y-5'>
            {customFields.map(field => (
              <div key={field.id} className='px-4 py-2 bg-stone-700 text-white rounded-md'>
                <div className='flex justify-between'>
                  <div><b>{field.name}</b></div>
                  <button
                    type='button'
                    className='text-blue-300'
                    onClick={() => removeField(field.id)}
                  >
                    Entfernen
                  </button>
                </div>
                <div className='flex justify-between'>
                  {/* @ts-ignore*/}
                  <div>{labelOfFieldIds[field.typeId]}</div>
                  <div>{(field.typeId === 'text' || field.typeId === 'number') && (field.required ? 'Pflichtfeld' : 'Optional')}</div>
                  {field.typeId === 'select' && (
                    <>
                    <div className='ml-5'>
                      <div><b>Optionen:</b></div>
                      <div className='pl-6'>
                        {field.options.map(option => (
                          <div key={option.id}>{option.name}</div>
                        ))}
                      </div>
                    </div>
                    <div className=' flex-grow'></div>
                    </>
                  )}
                </div>
            </div>
            ))}
            <Select name='newCustomField' className='bg-lime-600 text-lime-50' inputElementRef={addFieldSelectElementRef}
              onChange={(e) => addField(e.target.value)}
            >
              <option value='add-field' className='bg-white text-stone-400'>Feld hinzufügen</option>
              <AddCustomFieldSelectOptions
                availableCustomFields={availableCustomFields.filter( f => !f.adminOnly)}
                customFields={customFields}
              />
            </Select>
          </div>
        </Box>

        <Box>
          <SubmitButton>Create Event</SubmitButton>
        </Box>
      </SpaceY>
      </Form>
    </div>
  )
}
