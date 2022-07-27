import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
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

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminId(request);
  return json({});
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

  console.log(event);

  return redirect(`/admin/event/${/*event.id*/'1'}`);
}

export default function NewEventPage() {

  const actionData = useActionData() as ActionData;

  return (
    <>
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
          <SubmitButton>Create Event</SubmitButton>
        </Box>
      </SpaceY>
      </Form>
    </>
  )
}
