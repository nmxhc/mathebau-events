import type { ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import type { FC } from 'react'
import { Box } from '~/components/elementary/Box'
import { H1 } from '~/components/elementary/H1'
import { verifyAdminLogin } from '~/models/admin.server';
import { createAdminSession, getAdminId } from '~/session_admin.server'
import { safeRedirect, validateEmail } from '~/utils';
import { SubmitButton } from '~/components/forms/SubmitButton';
import { InputWithLabelAndErrorMessage } from '~/components/forms/InputWithLabelAndErrorMessage';

export const loader: LoaderFunction = async ({ request }) => {
  const adminId = await getAdminId(request);
  if (adminId) return redirect("/admin/events");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/admin/events");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const admin = await verifyAdminLogin(email, password);

  if (!admin) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createAdminSession({
    request,
    adminId: admin.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

const LoginPage:FC = () => {

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/events";
  const actionData = useActionData() as ActionData;

  return (
    <div data-cy="admin-login-page">
      <H1>Admin Login</H1>
      <Box>
      <Form method="post" className="space-y-6">
        <InputWithLabelAndErrorMessage
          type="email"
          name="email"
          label="Email"
          invalid={actionData?.errors?.email !== undefined}
          errorMessage={actionData?.errors?.email}
        />
        <InputWithLabelAndErrorMessage
          type="password"
          name="password"
          label="Passwort"
          invalid={actionData?.errors?.password !== undefined}
          errorMessage={actionData?.errors?.password}
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <SubmitButton>
          Als Admin einloggen
        </SubmitButton>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center mr-4">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-stone-100"
            >
              Angemeldet bleiben
            </label>
          </div>
          <div className="text-center text-sm text-stone-500">
            Du hast noch keinen Admin-Account? Frag einen Admin.
          </div>
        </div>
      </Form>
      </Box>
    </div>
  )
}

export default LoginPage
