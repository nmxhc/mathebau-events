import type { ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import type { FC } from 'react'
import React from 'react'
import { Box } from '~/components/Box'
import { Footer } from '~/components/Footer'
import { H1 } from '~/components/H1'
import { Input } from '~/components/Input';
import { InputError } from '~/components/InputError';
import { InputWrapper } from '~/components/InputWrapper';
import { Label } from '~/components/Label';
import { Main } from '~/components/Main'
import { Navbar } from '~/components/Navbar'
import { PageWrapper } from '~/components/PageWrapper'
import { verifyAdminLogin } from '~/models/admin.server';
import { createAdminSession, getAdminId } from '~/session_admin.server'
import { safeRedirect, validateEmail } from '~/utils';

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
    <PageWrapper>
      <Navbar />
      <Main>
        <H1>Login as Admin</H1>
        <Box>
        <Form method="post" className="space-y-6">
          <div>
            <Label htmlFor='email'>
              Email
            </Label>
            <InputWrapper>
              <Input
                name={'email'}
                type={'email'}
                invalid={actionData?.errors?.email ? true : undefined}
              />
              {actionData?.errors?.email && (
                <InputError errorFor='email'>{actionData.errors.email}</InputError>
              )}
            </InputWrapper>
          </div>

          <div>
            <Label htmlFor='password'>
              Password
            </Label>
            <InputWrapper>
              <Input name='password' type='password'
                invalid={actionData?.errors?.password ? true : undefined}
              />
              {actionData?.errors?.password && (
                <InputError errorFor='password'>{actionData.errors.password}</InputError>
              )}
            </InputWrapper>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 transition duration-200 ease-in-out"
          >
            Log in
          </button>
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
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-stone-500">
              Don't have an account?{" "}
              Ask an admin
            </div>
          </div>
        </Form>
        </Box>
      </Main>
      <Footer />
    </PageWrapper>
  )
}

export default LoginPage
