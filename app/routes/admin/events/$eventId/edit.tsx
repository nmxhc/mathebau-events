import { Form, Link, useActionData } from '@remix-run/react';
import type { ActionFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { EventDataInputs } from '~/components/admin/events/new/EventDataInputs';
import { Button } from '~/components/elementary/Button';
import { H2 } from '~/components/elementary/H2';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { getEventWithAdminDetails, updateEvent } from '~/models/event.server';
import { requireAdminId } from '~/session_admin.server';
import { useMatchesData } from '~/utils';
import { newEventFormValidationSchema } from '~/utils/forms/new-event';
import type { ActionData} from '~/utils/forms/validation';
import { errorResponse, validateAndParseFormData } from '~/utils/forms/validation';
import type { LoaderData } from '../$eventId';

export const action:ActionFunction = async ({ request, params }) => {
  const adminId = await requireAdminId(request);
  const eventId = params.eventId as string;
  const event = await getEventWithAdminDetails(eventId);
  const formData = await request.formData();

  if (!event?.eventAdmins.findIndex((admin) => (admin.id === adminId))) {
    return redirect('/admin/events');
  }

  const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, newEventFormValidationSchema);

  if (errors) {
    return errorResponse(errors, formDataForRefill);
  }

  await updateEvent(eventId, parsedData as Parameters<typeof updateEvent>[1])

  return redirect(`/admin/events/${params.eventId}`)
} 

const EventEditPage = () => {
  const { event } = useMatchesData('routes/admin/events/$eventId') as LoaderData;
  const actionData = useActionData() as ActionData;

  return (
    <div data-cy='admin-event-page-edit'>
      <SplitLeftRight>
        <H2>Event Bearbeiten</H2>
        <Link to={`/admin/events/${event.id}`}>
          <Button color='stone'>Abbrechen</Button>
        </Link>
      </SplitLeftRight>
      <Form method='post'>
        <EventDataInputs defaultValues={event} errors={actionData?.errors} />
        <div className='pt-3'></div>
        <SubmitButton>Änderungen Speichern</SubmitButton>
      </Form>
    </div>
  )
}

export default EventEditPage