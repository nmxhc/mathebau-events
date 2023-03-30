import { Form, Outlet, useActionData, useCatch, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { useEffect, useState } from 'react';
import { EventSignupInfo } from '~/components/admin/events/EventSignupInfo';
import { Box } from '~/components/elementary/Box';
import { Button } from '~/components/elementary/Button';
import { H1 } from '~/components/elementary/H1'
import { H2 } from '~/components/elementary/H2';
import { SpaceY } from '~/components/elementary/SpaceY';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import { addAdminToEvent, deleteEvent, getEventWithAdminDetails, setVisibility } from '~/models/event.server'
import { requireAdminId } from '~/session_admin.server';
import { EventSignupTable, handleDownloadCsv } from '~/components/admin/events/EventSignupTable';
import { unvalidateEmailOfParticipant, validateEmailOfParticipant } from '~/models/participant.server';
import { deleteSinupById } from '~/models/signup.server';
import { DeleteModal } from '~/components/elementary/modals/DeleteModal';
import { updateCustomInputValue } from '~/models/custom-fields.server';
import { FormModal } from '~/components/elementary/modals/FormModal';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';
import type { ActionData} from '~/utils/forms/validation';
import { errorResponse } from '~/utils/forms/validation';
import { getAdminByEmail } from '~/models/admin.server';

export type LoaderData = {
  event: NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const adminId = await requireAdminId(request);
  const event = await getEventWithAdminDetails(params.eventId)
  
  if (!event) {
    throw new Response("Event not found", {
      status: 404,
    })
  }

  if (event.eventAdmins.findIndex(ea => ea.adminId === adminId) === -1) {
    throw new Response("Unauthorized to view Event", {
      status: 401,
    })
  }

  return json<LoaderData>({ event })
}

export const action:ActionFunction = async ({ request, params }) => {
  const adminId = await requireAdminId(request);
  const event = await getEventWithAdminDetails(params.eventId)

  if (!event) {
    throw new Response("Event not found", {
      status: 404,
    })
  }

  if (event.eventAdmins.findIndex(ea => ea.adminId === adminId) === -1) {
    throw new Response("Unauthorized", {
      status: 401,
    })
  }

  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'delete') {
    await deleteEvent(event.id)
    return redirect(`/admin/events`)
  }

  if (action === 'update-email-validation') {
    const signupId = formData.get('signupId');
    const validatedEmail = formData.has('validatedEmail');
    const emailValidationToken = event.signups.find(s => s.id === signupId)?.participant.emailValidationToken;
    if (validatedEmail) {
      await validateEmailOfParticipant(emailValidationToken)
    } else {
      await unvalidateEmailOfParticipant(emailValidationToken)
    }
  }

  if (action === 'update-admin-only-checkbox') {
    const signupId = formData.get('signupId') as string;
    const value = formData.has('value') ? 'true' : 'false';
    const eventInputField = event.eventInputFields.find(eif => eif.id === formData.get('eventInputFieldId'));
    if (eventInputField) {
      await updateCustomInputValue({eventInputFieldId: eventInputField.id, signupId, value})
    }
  }

  if (action === 'update-admin-only-text') {
    const signupId = formData.get('signupId') as string;
    const value = formData.get('value') as string;
    const eventInputField = event.eventInputFields.find(eif => eif.id === formData.get('eventInputFieldId'));
    if (eventInputField) {
      await updateCustomInputValue({eventInputFieldId: eventInputField.id, signupId, value})
    }
  }

  if (action === 'delete-signup') {
    const signupId = formData.get('signupId') as string;
    await deleteSinupById(signupId);
  }

  if (action === 'update-visibility') {
    await setVisibility(event.id, !event.visible)
  }

  if (action === 'add-admin') {
    const email = formData.get('Email');
    if (!email || typeof email !== 'string') {
      return errorResponse({email: 'Bitte gib eine Mailadresse ein'})
    }
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return errorResponse({email: 'Kein Admin mit dieser Mailadresse gefunden'})
    }
    await addAdminToEvent(event.id, admin.id)
  }

  return redirect(`/admin/events/${event.id}`)
}

const EventDetailsPage = () => {

  const actionData = useActionData() as ActionData;

  const { event } = useLoaderData() as LoaderData;
  const [shownModal, setShownModal] = useState<'delete' | 'add-admin' | null>(null);
  const [signupTableEditable, setSignupTableEditable] = useState(true);

  const closeModal = () => setShownModal(null);

  useEffect(() => {
    setSignupTableEditable(false);
  }, [])

  const copyAllEmails = () => {
    const emails = event.signups.map(s => s.participant.email).join('; ');
    navigator.clipboard.writeText(emails);
  }

  return (
    <div data-cy='admin-event-page'>
      <H1>{event.name}</H1>
      <SpaceY>
        <Box>
          <Outlet />
        </Box>
        <Box>
          <H2>Event Status</H2>
          <p><b>Anmeldungen:</b> {event.signups.length}{event.participantsLimit && `/${event.participantsLimit}`} </p>
          <div className='flex justify-start align-middle'>
            <p>
              <b>Sichtbar auf Startseite:</b> {event.visible ? 'Ja' : 'Nein'}
            </p>
            <Form method='post'>
              <input type='hidden' name='action' value='update-visibility' />
              <button className='ml-5 text-blue-300' type='submit'>Ändern</button>
            </Form>
          </div>
          <EventSignupInfo event={event} />
        </Box>
        
        <Box>
          <SplitLeftRight>
            <H2>Anmeldungen</H2>
            <div>
              <Button color='blue' onClick={copyAllEmails} className='mr-3'>
                Copy all Emails
              </Button>
              <Button color='lime' onClick={() => handleDownloadCsv(event)} className='mr-3'>
                CSV-Export
              </Button>
              <Button color='red' onClick={() => setSignupTableEditable(!signupTableEditable)}>
                {signupTableEditable ? 'Bearbeiten Sperren' : 'Bearbeiten'}
              </Button>
            </div>
          </SplitLeftRight>
          <EventSignupTable event={event} editable={signupTableEditable} />
        </Box>
        <Box>
          <SplitLeftRight>
            <H2>Event-Admins</H2>
            <Button color='lime' onClick={() => setShownModal('add-admin')}>
              Admin hinzufügen
            </Button>
          </SplitLeftRight>
          {event.eventAdmins.map(ea => (
            <p key={ea.adminId}><b>{ea.admin.name}</b>: {ea.admin.email}</p>
          ))}
        </Box>
        <Button dataCy='delete-event-button' color='red' className='float-right' onClick={() => setShownModal('delete')}>
          Event Löschen
        </Button>
      </SpaceY>

      <FormModal isShown={shownModal === 'add-admin'} closeModal={closeModal} title='Neuen Admin zu Event hinzufügen'>
        <Form method='post'>
          <input type='hidden' name='action' value='add-admin' />
          <InputWithLabelAndErrorMessage
            type='email'
            name='Email'
            invalid={actionData?.errors?.email !== undefined}
            errorMessage={actionData?.errors?.email}
            />
          <SubmitButton>Hinzufügen</SubmitButton>
        </Form>
      </FormModal>

      <DeleteModal isShown={shownModal === 'delete'} closeModal={closeModal}>
        <p>Bist du sicher, dass du <i>"{event.name}"</i> unwiederruflich löschen möchtest?</p>
      </DeleteModal>
    </div>
  )
}

export default EventDetailsPage

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div data-cy='catch-boundary'>
      <H1>{caught.status} Error: {caught.data}</H1>
    </div>
  )
}