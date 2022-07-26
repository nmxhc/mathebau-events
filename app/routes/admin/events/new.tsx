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
import { errorResponse} from '~/utils/forms/validation';
import { someErrors } from '~/utils/forms/validation';
import { getFormDataErrors } from '~/utils/forms/validation';
import { newEventFormValidationSchema } from '~/utils/forms/new-event';

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminId(request);
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const adminId = await requireAdminId(request);
  const formData = await request.formData();
  const errors = getFormDataErrors(formData, newEventFormValidationSchema);

  if (someErrors(errors)) {
    return errorResponse(errors);
  }

  // Create the event
  // const event = await createEvent({
  //   name: eventName,
  //   startDate: new Date(startDate),
  //   endDate: dateTimePlusMinutes(new Date(dateStringPlusDays(startDate, 1)),-1),
  //   location,
  //   description,
  //   signupStartDate: new Date(signupStartDate),
  //   signupEndDate: dateTimePlusMinutes(new Date(dateStringPlusDays(signupStartDate, 1)),-1),
  //   participantsLimit: participantsLimitInt,
  //   cost: cost ? cost : undefined,
  //   adminId
  // });

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
        />

        <Box>
          <SubmitButton>Create Event</SubmitButton>
        </Box>
      </SpaceY>
      </Form>
    </>
  )
}
