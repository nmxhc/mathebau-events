import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData, useSearchParams } from '@remix-run/react';
import { Box } from '~/components/elementary/Box';
import { H1 } from '~/components/elementary/H1';
import { requireAdminId } from '~/session_admin.server';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { SpaceY } from '~/components/elementary/SpaceY';
import { EventDataInputs } from '~/components/admin/events/new/EventDataInputs';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import type { ActionData} from '~/utils/forms/validation';
import { validateAndParseFormData} from '~/utils/forms/validation';
import { errorResponse} from '~/utils/forms/validation';
import { newEventFormValidationSchema } from '~/utils/forms/new-event';
import type { createEventArguments } from '~/models/event.server';
import { createEvent } from '~/models/event.server';
import { H2 } from '~/components/elementary/H2';
import { useRef, useState } from 'react';
import { createCustomField, getCustomFields } from '~/models/custom-fields.server';
import type { ArrayElement } from '~/utils';
import { SelectedCustomFields } from '~/components/admin/events/new/SelectedCustomFields';
import { CustomFieldSelection } from '~/components/admin/events/new/CustomFieldSelection';
import type { CreateCustomFieldModalHandle } from '~/components/admin/events/new/CreateCustomFieldModal';
import { CreateCustomFieldModal } from '~/components/admin/events/new/CreateCustomFieldModal';

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
  const action = formData.get('action') as string;
  if (action === 'create-event') {  
    const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, newEventFormValidationSchema);

    if (errors) {
      return errorResponse(errors, formDataForRefill);
    }

    const customFieldIds = JSON.parse(formData.get('selected-custom-fields') as string);

    const eventData = parsedData as createEventArguments['event'];
    eventData.visible = true;

    const event = await createEvent({
      event: eventData,
      customFieldIds,
      adminId
    });

    return redirect(`/admin/events/${event.id}`);
  }
  if (action === 'create-custom-field') {
    const name = formData.get('input-name') as string
    const type = formData.get('field-type') as string
    const required = formData.get('required') ? true : false;
    const adminOnly = formData.get('admin-only') ? true : false;
    const options = (formData.get('select-options') as string|null )?.split(',').map(s => s.trim()).filter(s => s.length > 0)

    const customField = await createCustomField({
      name,
      type,
      options,
      required,
      adminOnly
    }) //todo: add this to the list of custom fields

    return redirect(`/admin/events/new?created-custom-field=${customField.id}`)
  }
}

export default function NewEventPage() {

  const actionData = useActionData() as ActionData;
  const [searchParams] = useSearchParams();
  const createdCustomFieldId = searchParams.get('created-custom-field');
  const { availableCustomFields } = useLoaderData() as LoaderData;

  const [lastAddedCustomFieldId, setLastAddedCustomFieldId] = useState<string | null>(null);

  const commentsField = availableCustomFields.find(iF => iF.name === 'Kommentare')
  const initialCustomFields = commentsField ? [commentsField] : []
  const [customFields, setCustomFields] = useState<CustomField[]>(initialCustomFields);
  if (createdCustomFieldId) {
    const createdCustomField = availableCustomFields.find(c => c.id === createdCustomFieldId);
    if (createdCustomField) {
      if (lastAddedCustomFieldId !== createdCustomFieldId) {
        setLastAddedCustomFieldId(createdCustomFieldId);
        setCustomFields([...customFields, createdCustomField]);
      }
    }
  }
  const addFieldSelectElementRef = useRef<HTMLSelectElement>(null);
  const createCustomModalRef = useRef<CreateCustomFieldModalHandle>(null);

  const handleCustomFieldSelectionChange = (value: string) => {
    addFieldSelectElementRef.current!.value = 'add-field';
    if (value === 'add-field') {
      return;
    }

    if (value === 'create-new-field') {
      createCustomModalRef.current!.toggleModal();
      return;
    }

    addField(value);
  }

  const addField = (fieldId: string) => {
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

  const [addedPaidField, setAddedPaidField] = useState<boolean>(false);

  const handleCostInputChanged = (value: string) => {
    if (!addedPaidField) {
      setAddedPaidField(true)
      const paidInputField = availableCustomFields.find(field => field.name === 'Bezahlt');
      if (paidInputField) {
        setCustomFields([...customFields, paidInputField]);
      }
    }
  }

  return (
    <div data-cy='new-event-page'>
      <SplitLeftRight>
        <H1>Erstelle ein neues Event</H1>
        <Link to='/admin/events'><span className='text-blue-300'>Zurück</span></Link>
      </SplitLeftRight>

      <Form method="post">
      <SpaceY>
      <Box>
        <SpaceY>
          <H2>Eventdaten</H2>
          <EventDataInputs
            errors={actionData?.errors}
            formDataForRefill={actionData?.formDataForRefill}
            costInputChanged={(e) => handleCostInputChanged(e.target.value)}
          />
        </SpaceY>
      </Box>

        <Box>
          <H2>Abfragefelder</H2>
          <SelectedCustomFields customFields={customFields} removeField={removeField} />
          <CustomFieldSelection
            availableCustomFields={availableCustomFields}
            customFields={customFields}
            onChange={handleCustomFieldSelectionChange}
            addFieldSelectElementRef={addFieldSelectElementRef} />
        </Box>
        <Box>
          <SubmitButton>Create Event</SubmitButton>
        </Box>
        <input type='hidden' name='action' value='create-event' />
      </SpaceY>
      </Form>
      <CreateCustomFieldModal ref={createCustomModalRef} />
    </div>
  )
}
