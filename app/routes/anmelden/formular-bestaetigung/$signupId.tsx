import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction} from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { Box } from '~/components/elementary/Box'
import { H1 } from '~/components/elementary/H1'
import { getSignupById } from '~/models/signup.server';

type LoaderData = {
  signup: NonNullable<Awaited<ReturnType<typeof getSignupById>>>
};

export const loader: LoaderFunction = async ({ params }) => {
  const signup = await getSignupById(params.signupId);
  return json({ signup });
}


const SignupFormSuccessPage = () => {

  const { signup } = useLoaderData() as LoaderData;

  return (
    <div data-cy='signup-form-success-page'>
      <H1>Deine Anmeldung für <b>{signup.event.name}</b> war erfolgreich!</H1>
      <Box>
        <p>
          Bitte bestätige deine Mailadresse, indem du auf den Bestätigungslink klickst, den wir dir geschickt haben.
        </p>
      </Box>
    </div>
  )
}

export default SignupFormSuccessPage
