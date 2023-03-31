import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { Box } from '~/components/elementary/Box';
import { H1 } from '~/components/elementary/H1'
import { getParticipantByMailToken, validateEmailOfParticipant } from '~/models/participant.server';
import { getSignupByParticipantId, isSignupOnWaitlist } from '~/models/signup.server';
import { sendEventSignupConfirmationEmail } from '~/utils/email';

type LoaderData = {
  participant: NonNullable<Awaited<ReturnType<typeof validateEmailOfParticipant>>>
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.mailToken) {
    return json({ participant: null });
  }
  const participant = await getParticipantByMailToken(params.mailToken);
  if (!participant) {
    return json({ participant: null });
  }
  await validateEmailOfParticipant(params.mailToken);
  const signup = await getSignupByParticipantId(participant.id);
  if (signup && !participant.validatedEmail) {
    const isOnWaitlist = await isSignupOnWaitlist(signup.id);
    sendEventSignupConfirmationEmail(signup, isOnWaitlist)
  }
  return json({ participant });
}

const ValidateMailPage = () => {

  const { participant } = useLoaderData() as LoaderData;

  return (
    <div data-cy='validate-mail-page'>
      <H1>Hallo {participant.name}</H1>
      <Box>
        Deine Mailadresse wurde erfolgreich bestätigt. Du solltest in Kürze eine Mail mit der Zusammenfassung deiner Anmeldung erhalten. Falls nicht, schau bitte auch in deinem Spam-Ordner nach.
      </Box>
    </div>
  )
}

export default ValidateMailPage