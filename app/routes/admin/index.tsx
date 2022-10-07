import { Link, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { useRef } from 'react';
import { AdminEventBox } from '~/components/admin/AdminEventBox';
import type { CreateCustomFieldModalHandle} from '~/components/admin/CreateNewAdminModal';
import { CreateNewAdminModal } from '~/components/admin/CreateNewAdminModal';
import type { DeleteModalHandle } from '~/components/admin/events/event/DeleteModal';
import { DeleteModal } from '~/components/admin/events/event/DeleteModal';
import { Box } from '~/components/elementary/Box';
import { Button } from '~/components/elementary/Button';
import { H1 } from '~/components/elementary/H1';
import { H2 } from '~/components/elementary/H2';
import { SplitLeftRight } from '~/components/elementary/SplitLeftRight';
import type { CreateAdminArguments} from '~/models/admin.server';
import { createAdmin, deleteAdmin } from '~/models/admin.server';
import { getAdminEvents } from '~/models/event.server';
import { getAdminSession, requireAdmin, sessionStorage } from '~/session_admin.server';
import type { ArrayElement } from '~/utils';
import { newAdminFormValidationSchema } from '~/utils/forms/new-admin';
import type { ActionData} from '~/utils/forms/validation';
import { errorResponse, validateAndParseFormData } from '~/utils/forms/validation';

type LoaderData = {
  admin: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>;
  event: ArrayElement<NonNullable<Awaited<ReturnType<typeof getAdminEvents>>>> | null;
  message: string | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getAdminSession(request)
  console.log(session.get('adminId'))
  console.log(session.has('globalMessage'))
  const message = session.get('globalMessage') || null;
  const admin = await requireAdmin(request)
  console.log('message', message)
  const events = await getAdminEvents(admin.id)
  return json({ admin, event: events[0], message });
}

export const action: ActionFunction = async ({ request }) => {
  const admin = await requireAdmin(request)
  const formData = await request.formData();
  if (formData.get('action') === 'delete') {
    deleteAdmin(admin.id)
    return redirect('/')
  }
  if (formData.get('action') === 'create-new-admin') {
    const { errors, formDataForRefill, parsedData } = validateAndParseFormData(formData, newAdminFormValidationSchema);
    if (errors) {
      return errorResponse(errors, formDataForRefill);
    }
    const session = await getAdminSession(request);
    session.flash('globalMessage', 'New admin created');
    console.log(session.get('adminId'))
    console.log('flashed message')
    await createAdmin(parsedData as CreateAdminArguments);
    console.log(session.has('globalMessage'))
    return redirect('/admin', {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    });
  }
}

export default function AdminHomePage() {

  const actionData = useActionData<ActionData>();
  const { admin, event, message } = useLoaderData<LoaderData>();
  const deleteModalRef = useRef<DeleteModalHandle>(null);
  const createNewAdminModalRef = useRef<CreateCustomFieldModalHandle>(null);
  if (message) {
    createNewAdminModalRef.current?.hideModal();
  }

  return (
    <div data-cy='admin-home-page'>
      <SplitLeftRight>
        <H1>Admin Panel</H1>
        <Button color='red' className='mb-3' onClick={() => deleteModalRef.current?.toggleModal()}>  
          Account Löschen
        </Button>
      </SplitLeftRight>
      {event ? (<>
        <H2 className='mb-3'>Dein aktuellstes Event:</H2>
        <AdminEventBox event={event} />
        <Link to='/admin/events'>
          <Button color='lime' className='w-full mt-3 mb-5'><b>Alle deine Events</b></Button>
        </Link>
      </>) : (<>
        <H2 className='mb-3'>Du hast noch kein Event erstellt.</H2>
        <Link to='/admin/events/new'>
          <Button color='lime' className='w-full mb-5'><b>Neues Event erstellen</b></Button>
        </Link>
      </>)}
      <Box>
        <p><b>Deine Daten:</b></p>
        <p><b>Name:</b> {admin.name}</p>
        <p><b>Email:</b> {admin.email}</p>
      </Box>
      <Button color='lime' className='w-full mt-3' onClick={() => createNewAdminModalRef.current?.toggleModal()}><b>Neuen Admin anlegen</b></Button>

      <CreateNewAdminModal ref={createNewAdminModalRef} actionData={actionData} />

      <DeleteModal ref={deleteModalRef}>
        <p>Willst du deinen Admin Account <i>{admin.name}</i> unwiederruflich löschen? Du verlierst damit Zugriff auf alle Events, für die du aktuell Administrator bist. Events werden nicht automatisch gelöscht.</p>
      </DeleteModal>
    </div>
  )
}