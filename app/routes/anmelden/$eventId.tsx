import { Form, useActionData, useCatch, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { Box } from '~/components/elementary/Box';
import { H1 } from '~/components/elementary/H1';
import { SpaceY } from '~/components/elementary/SpaceY';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { EventInfos } from '~/components/home_page/EventInfos';
import type { getEventById } from '~/models/event.server';
import { createParticipant } from '~/models/participant.server';
import { signupParticipant } from '~/models/signup.server';
import { requireEvent } from '~/utils/events';
import { signupEventFormValidationSchema } from '~/utils/forms/event-signup';
import type { ActionData} from '~/utils/forms/validation';
import { errorResponse, validateAndParseFormData } from '~/utils/forms/validation';

type LoaderData = {
  event: NonNullable<Awaited<ReturnType<typeof getEventById>>>
}

export const loader:LoaderFunction = async ({ request, params }) => {
  const event = await requireEvent(params.eventId);
  return json<LoaderData>({ event })
}

export const action:ActionFunction = async ({ request, params }) => {
  const event = await requireEvent(params.eventId);
  const formData = await request.formData();
  const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, signupEventFormValidationSchema);

  if (errors) {
    return errorResponse(errors, formDataForRefill);
  }

  const participant = await createParticipant({
      name: parsedData.name,
      email: parsedData.email,
      dedicatedToOneSignup: true
  });

  const signup = await signupParticipant({
    participantId: participant.id,
    eventId: event.id,
  })

  return redirect(`/anmelden/formular-bestaetigung/${signup.id}`);
}

const EventSignupPage = () => {
  const { event } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  return (
    <div data-cy='event-signup-page'>
      <H1>Anmelden für {event.name}</H1>
      <SpaceY>
        <Box>
          <EventInfos event={event} />
        </Box>
        <Box>
          <Form method='post' className="space-y-5">
            <InputWithLabelAndErrorMessage
              label='Name'
              name='name'
              type='text'
              invalid={actionData?.errors?.name !== undefined}
              errorMessage={actionData?.errors?.name}
            />
            <InputWithLabelAndErrorMessage
              label='E-Mail'
              name='email'
              type='email'
              invalid={actionData?.errors?.email !== undefined}
              errorMessage={actionData?.errors?.email}
            />
            <SubmitButton>Anmelden</SubmitButton>
          </Form>
        </Box>
      </SpaceY>
    </div>
  )
}

export default EventSignupPage;

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div data-cy='catch-boundary'>
      <H1>{caught.status} Error: {caught.data}</H1>
    </div>
  )
}