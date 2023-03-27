import { Form, useActionData, useCatch, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { EventSignupInfo } from '~/components/admin/events/EventSignupInfo';
import { Box } from '~/components/elementary/Box';
import { H1 } from '~/components/elementary/H1';
import { SpaceY } from '~/components/elementary/SpaceY';
import { CheckboxWithLabel } from '~/components/forms/CheckboxWithLabel';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import { SelectWithLabelAndErrorMessage } from '~/components/forms/SelectWithLabelAndErrorMessage';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { EventInfos } from '~/components/home_page/EventInfos';
import type { getEventById } from '~/models/event.server';
import { createParticipant } from '~/models/participant.server';
import { signupParticipant } from '~/models/signup.server';
import { getTodayDateString } from '~/utils/dates';
import { sendNewParticipantSignupEmail } from '~/utils/email';
import { requireEvent } from '~/utils/events';
import { signupEventFormValidationSchema } from '~/utils/forms/event-signup';
import type { ActionData} from '~/utils/forms/validation';
import { errorResponse, validateAndParseFormData } from '~/utils/forms/validation';
import { getCustomFieldsValidationSchema } from '~/utils/forms/validation/custom-fields';

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
  const customFieldsValidationSchema = getCustomFieldsValidationSchema(event.eventInputFields.filter(eIF => !eIF.inputField.adminOnly));
  const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, [...customFieldsValidationSchema, ...signupEventFormValidationSchema]);

  if (errors) {
    return errorResponse(errors, formDataForRefill);
  }

  const { name, email, ...customFields } = parsedData;

  // TODO catch error
  const participant = await createParticipant({
      name,
      email,
      dedicatedToOneSignup: true
  });

  //TODO catch errors and delete participant if signup fails
  const signup = await signupParticipant({
    participantId: participant.id,
    eventId: event.id,
    customFields
  })

  sendNewParticipantSignupEmail(participant, event)

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
          { (new Date(event.signupStartDate) > new Date(getTodayDateString())
          || new Date(event.signupEndDate) < new Date(getTodayDateString()))
          ? <EventSignupInfo event={event} />
          : <Form method='post' className="space-y-5">
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
              {event.eventInputFields.map((eIF) => (
                <div key={eIF.id}>
                  {(eIF.inputField.typeId === 'text' || eIF.inputField.typeId === 'number') && (
                    <InputWithLabelAndErrorMessage
                      label={eIF.inputField.name}
                      name={eIF.inputField.name}
                      type={eIF.inputField.typeId}
                      invalid={actionData?.errors?.[eIF.inputField.name] !== undefined}
                      errorMessage={actionData?.errors?.[eIF.inputField.name]}
                    />
                  )}
                  {eIF.inputField.typeId === 'select' && (
                    <SelectWithLabelAndErrorMessage
                      label={eIF.inputField.name}
                      name={eIF.inputField.name}
                      invalid={actionData?.errors?.[eIF.inputField.name] !== undefined}
                      errorMessage={actionData?.errors?.[eIF.inputField.name]}
                    >
                      {eIF.inputField.options.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </SelectWithLabelAndErrorMessage>
                  )}
                  {eIF.inputField.typeId === 'checkbox' && (
                    <CheckboxWithLabel
                      label={eIF.inputField.name}
                      name={eIF.inputField.name}
                    />
                  )}
                </div>
              ))}
              <SubmitButton>Anmelden</SubmitButton>
            </Form>
          }
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