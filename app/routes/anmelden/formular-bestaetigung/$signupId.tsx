import React from 'react'
import { Box } from '~/components/elementary/Box'
import { H1 } from '~/components/elementary/H1'

const SignupFormSuccessPage = () => {
  return (
    <div data-cy='signup-form-success-page'>
      <H1>Anmeldung erfolgreich!</H1>
      <Box>
        <p>
          Bitte bestätige deine Mailadresse indem du auf den Bestätigungslink klickst, den wir dir an deine Mailadresse geschickt haben.
        </p>
      </Box>
    </div>
  )
}

export default SignupFormSuccessPage
