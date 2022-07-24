import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { useRef } from 'react';
import { Box } from '~/components/Box';
import { Footer } from '~/components/Footer';
import { H1 } from '~/components/H1';
import { Input } from '~/components/Input';
import { InputError } from '~/components/InputError';
import { InputWrapper } from '~/components/InputWrapper';
import { Label } from '~/components/Label';
import { Main } from '~/components/Main';
import { Navbar } from '~/components/Navbar';
import { PageWrapper } from '~/components/PageWrapper';
import { createEvent } from '~/models/event.server';
import { requireAdminId } from '~/session_admin.server';
import { datePlusDays, dateTimePlusMinutes, dateToString } from '~/utils';

interface ActionData {
  errors?: {
    eventName?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    location?: string;
    signupStartDate?: string;
    signupEndDate?: string;
    participantsLimit?: string;
    cost?: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminId(request);
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const adminId = await requireAdminId(request);

  const formData = await request.formData();
  const eventName = formData.get("eventName");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const location = formData.get("location");
  const description = formData.get("description");
  const signupStartDate = formData.get("signupStartDate");
  const signupEndDate = formData.get("signupEndDate");
  const participantsLimit = formData.get("participantsLimit");
  const cost = formData.get("cost");

  // Validation of the form data
  if (typeof eventName !== "string" || eventName.length === 0) {
    return json<ActionData>(
      { errors: { eventName: "Event name is required" } },
      { status: 400 }
    );
  }

  if (typeof startDate !== "string" || startDate.length === 0) {
    return json<ActionData>(
      { errors: { startDate: "Start date is required" } },
      { status: 400 }
    );
  }

  if (new Date(startDate) < new Date(dateToString(new Date()))) {
    return json<ActionData>(
      { errors: { startDate: "Start date must be in the future" } },
      { status: 400 }
    );
  }

  if (typeof endDate !== "string" || endDate.length === 0) {
    return json<ActionData>(
      { errors: { endDate: "End date is required" } },
      { status: 400 }
    );
  }

  if (new Date(endDate) < new Date(startDate)) {
    return json<ActionData>(
      { errors: { endDate: "End date must be after start date" } },
      { status: 400 }
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return json<ActionData>(
      { errors: { location: "Location is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>(
      { errors: { description: "Description is required" } },
      { status: 400 }
    );
  }

  if (typeof signupStartDate !== "string" || signupStartDate.length === 0) {
    return json<ActionData>(
      { errors: { signupStartDate: "Signup start date is required" } },
      { status: 400 }
    );
  }

  if (new Date(signupStartDate) < new Date(dateToString(new Date()))) {
    return json<ActionData>(
      { errors: { signupStartDate: "Signup start date must be in the future" } },
      { status: 400 }
    );
  }

  if (typeof signupEndDate !== "string" || signupEndDate.length === 0) {
    return json<ActionData>(
      { errors: { signupEndDate: "Signup end date is required" } },
      { status: 400 }
    );
  }

  if (new Date(signupEndDate) < new Date(signupStartDate)) {
    return json<ActionData>(
      { errors: { signupEndDate: "Signup end date must be after signup start date" } },
      { status: 400 }
    );
  }

  if (new Date(signupEndDate) > new Date(startDate)) {
    return json<ActionData>(
      { errors: { signupEndDate: "Signup end date must be before start date" } },
      { status: 400 }
    );
  }

  if (participantsLimit && typeof participantsLimit !== "number") {
    return json<ActionData>(
      { errors: { participantsLimit: "Participants limit must be a number" } },
      { status: 400 }
    );
  }

  if (cost && typeof cost !== "string") {
    return json<ActionData>(
      { errors: { cost: "Cost must be a string" } },
      { status: 400 }
    );
  }

  // Create the event
  const event = await createEvent({
    name: eventName,
    startDate: new Date(startDate),
    endDate: dateTimePlusMinutes(new Date(datePlusDays(startDate, 1)),-1),
    location,
    description,
    signupStartDate: new Date(signupStartDate),
    signupEndDate: dateTimePlusMinutes(new Date(datePlusDays(signupStartDate, 1)),-1),
    participantsLimit: participantsLimit ? parseInt(participantsLimit) : undefined,
    cost: cost ? cost : undefined,
    adminId
  });

  return redirect(`/admin/event/${event.id}`);
}

export default function NewEventPage() {

  const today = new Date().toISOString().split('T')[0]

  const actionData = useActionData() as ActionData;
  const startDateInput = useRef<HTMLInputElement>(null);
  const endDateInput = useRef<HTMLInputElement>(null);
  const signupStartDateInput = useRef<HTMLInputElement>(null);
  const signupEndDateInput = useRef<HTMLInputElement>(null);

  const startDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update end date to make sense
    if (endDateInput.current) {
      endDateInput.current.min = e.target.value;
      if (!endDateInput.current.value || new Date(endDateInput.current.value) < new Date(e.target.value)) {
        endDateInput.current.value = e.target.value;
      }
    }
    // update signup end date to make sense
    if (signupEndDateInput.current) {
      signupEndDateInput.current.max = datePlusDays(e.target.value, -1);
      if (!signupEndDateInput.current.value || new Date(signupEndDateInput.current.value) > new Date(datePlusDays(e.target.value, -1))) {
        signupEndDateInput.current.value = datePlusDays(e.target.value, -1);
      }
    }
    // update signup start date to make sense
    if (signupStartDateInput.current) {
      signupStartDateInput.current.max = datePlusDays(e.target.value, -1);
      if (new Date(signupStartDateInput.current.value) > new Date(datePlusDays(e.target.value, -1))) {
        signupStartDateInput.current.value = e.target.value;
      }
    }
  }

  const signupStartDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update signup end date to make sense
    if (signupEndDateInput.current) {
      signupEndDateInput.current.min = e.target.value;
      if (!signupEndDateInput.current.value || new Date(signupEndDateInput.current.value) < new Date(e.target.value)) {
        signupEndDateInput.current.value = e.target.value;
      }
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <div className='flex justify-between items-center'>
          <H1>Erstelle ein neues Event</H1>
          <Link to='/admin/events'><span className='text-blue-300'>Zurück</span></Link>
        </div>
        <Box>
        <Form method="post" className="space-y-6">
          <div>
            <Label htmlFor="eventName">Name des Events</Label>
            <InputWrapper>
              <Input name="eventName" type="text"
                invalid={actionData?.errors?.eventName ? true : undefined} />
              {actionData?.errors?.eventName && (
                <InputError errorFor={'eventName'}>{actionData.errors.eventName}</InputError>
              )}
            </InputWrapper>
          </div>

          <div className='flex'>
            <div className='flex-grow mr-3'>
              <Label htmlFor={'startDate'}>
                Startdatum
              </Label>
              <InputWrapper>
                <Input name='startDate' type='date' min={datePlusDays(today, 1)} reference={startDateInput}
                  onChange={startDateChanged}
                  invalid={actionData?.errors?.startDate ? true : undefined}
                />
                {actionData?.errors?.startDate && (<InputError errorFor='startDate'>
                  {actionData.errors.startDate}
                </InputError>)}
              </InputWrapper>
            </div>
            <div className='flex-grow'>
              <Label htmlFor={'endDate'}>
                Enddatum
              </Label>
              <InputWrapper>
                <Input name='endDate' type='date' min={datePlusDays(today, 1)} reference={endDateInput}
                  invalid={actionData?.errors?.endDate ? true : undefined}
                />
                {actionData?.errors?.endDate && (<InputError errorFor='endDate'>
                  {actionData.errors.endDate}
                </InputError>)}
              </InputWrapper>
            </div>
          </div>
          <div>
            <Label htmlFor="location">Veranstaltungsort</Label>
            <InputWrapper>
              <Input name="location" type="text"
                invalid={actionData?.errors?.location ? true : undefined} />
              {actionData?.errors?.location && (
                <InputError errorFor={'location'}>{actionData.errors.location}</InputError>
              )}
            </InputWrapper>
          </div>
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <InputWrapper>
              <Input name="description" type="textarea" rows={4}
                invalid={actionData?.errors?.description ? true : undefined} />
              {actionData?.errors?.description && (
                <InputError errorFor={'description'}>{actionData.errors.description}</InputError>
              )}
            </InputWrapper>
          </div>
          
          {/* signup dates */}
          <div className='flex'>
            <div className='flex-grow mr-3'>
              <Label htmlFor={'signupStartDate'}>
                Anmeldestart
              </Label>
              <InputWrapper>
                <Input name='signupStartDate' type='date' min={today} reference={signupStartDateInput}
                  onChange={signupStartDateChanged} defaultValue={today}
                  invalid={actionData?.errors?.signupStartDate ? true : undefined}
                />
                {actionData?.errors?.signupStartDate && (<InputError errorFor='signupStartDate'>
                  {actionData.errors.signupStartDate}
                </InputError>)}
              </InputWrapper>
            </div>
            <div className='flex-grow'>
              <Label htmlFor={'signupEndDate'}>
                Anmeldeschluss
              </Label>
              <InputWrapper>
                <Input name='signupEndDate' type='date' min={today} reference={signupEndDateInput}
                  invalid={actionData?.errors?.signupEndDate ? true : undefined}
                />
                {actionData?.errors?.signupEndDate && (<InputError errorFor='signupEndDate'>
                  {actionData.errors.signupEndDate}
                </InputError>)}
              </InputWrapper>
            </div>
          </div>

          <div className='flex'>
            {/* participants limit */}
            <div className='flex-grow mr-3'>
              <Label htmlFor={'participantsLimit'}>
                Teilnehmerlimit
              </Label>
              <InputWrapper>
                <Input name='participantsLimit' type='number'
                  invalid={actionData?.errors?.participantsLimit ? true : undefined}
                />
                {actionData?.errors?.participantsLimit && (<InputError errorFor='participantsLimit'>
                  {actionData.errors.participantsLimit}
                </InputError>)}
              </InputWrapper>
            </div>
            <div className='flex-grow'>
              <Label htmlFor={'cost'}>
                Kosten für Teilnehmer
              </Label>
              <InputWrapper>
                <Input name='cost' type='text'
                  invalid={actionData?.errors?.cost ? true : undefined}
                />
                {actionData?.errors?.cost && (<InputError errorFor='cost'>
                  {actionData.errors.cost}
                </InputError>)}
              </InputWrapper>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 transition duration-200 ease-in-out"
          >
            Create Event
          </button>
        </Form>
        </Box>
      </Main>
      <Footer />
    </PageWrapper>
  )
}
