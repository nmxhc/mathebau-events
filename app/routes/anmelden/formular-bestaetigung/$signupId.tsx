import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction} from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { Box } from '~/components/elementary/Box'
import { H1 } from '~/components/elementary/H1'
import { getSignupById, isSignupOnWaitlist } from '~/models/signup.server';

type LoaderData = {
  signup: NonNullable<Awaited<ReturnType<typeof getSignupById>>>
  isOnWaitlist: boolean
};

export const loader: LoaderFunction = async ({ params }) => {
  const signup = await getSignupById(params.signupId);
  let isOnWaitlist = false;
  if (signup) {
    isOnWaitlist = await isSignupOnWaitlist(signup.id);
    console.log('isOnWaitlist', isOnWaitlist)
  }
  return json({ signup, isOnWaitlist });
}


const SignupFormSuccessPage = () => {

  const { signup, isOnWaitlist } = useLoaderData() as LoaderData;

  return (
    <div data-cy='signup-form-success-page'>
      {!isOnWaitlist ? <H1>Deine Anmeldung für <b>{signup.event.name}</b> war erfolgreich!</H1> : <H1>Du stehst auf der Warteliste!</H1>  }
      <Box>
        <p>
          Bitte bestätige deine Mailadresse, indem du auf den Bestätigungslink klickst, den wir dir geschickt haben.
        </p>
      </Box>
    </div>
  )
}

export default SignupFormSuccessPage
