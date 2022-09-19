import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { H1 } from '~/components/elementary/H1'
import { validateEmailOfParticipant } from '~/models/participant.server';

type LoaderData = {
  participant: NonNullable<Awaited<ReturnType<typeof validateEmailOfParticipant>>>
};

export const loader: LoaderFunction = async ({ params }) => {
  const participant = await validateEmailOfParticipant(params.mailToken);
  return json({ participant });
}

const ValidateMailPage = () => {

  const { participant } = useLoaderData() as LoaderData;

  return (
    <div data-cy='validate-mail-page'>
      <H1>Hallo {participant.name}</H1>
      <p>
        Deine Mailadresse wurde erfolgreich bestätigt.
      </p>
    </div>
  )
}

export default ValidateMailPage