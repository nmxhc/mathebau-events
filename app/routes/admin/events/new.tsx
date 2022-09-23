import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, Outlet, ScrollRestoration, useActionData, useLoaderData } from '@remix-run/react';
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
import { SelectedCustomFields } from '~/components/admin/events/new/SelectedCustomFields';
import { CustomFieldSelection } from '~/components/admin/events/new/CustomFieldSelection';

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

  const customFieldIds = JSON.parse(formData.get('selected-custom-fields') as string);

  const event = await createEvent({
    event: parsedData as createEventArguments['event'],
    customFieldIds,
    adminId
  });

  return redirect(`/admin/events/${event.id}`);
}


export default function NewEventPage() {

  const actionData = useActionData() as ActionData;
  const { availableCustomFields } = useLoaderData() as LoaderData;

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const addFieldSelectElementRef = useRef<HTMLSelectElement>(null);
  const linkToCreateCustomFieldRef = useRef<HTMLAnchorElement>(null);

  const handleCustomFieldSelectionChange = (value: string) => {
    addFieldSelectElementRef.current!.value = 'add-field';
    if (value === 'add-field') {
      return;
    }

    if (value === 'create-new-field') {
      linkToCreateCustomFieldRef.current!.click();
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
          <SelectedCustomFields customFields={customFields} removeField={removeField} />
          <CustomFieldSelection
            availableCustomFields={availableCustomFields}
            customFields={customFields}
            onChange={handleCustomFieldSelectionChange}
            addFieldSelectElementRef={addFieldSelectElementRef} />
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <Link to='/admin/events/new/create-custom-field' ref={linkToCreateCustomFieldRef}></Link>
          <Outlet />
        </Box>

        <Box>
          <SubmitButton>Create Event</SubmitButton>
        </Box>
      </SpaceY>
      </Form>
    </div>
  )
}
