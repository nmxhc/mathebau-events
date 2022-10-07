import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { Admin } from "~/models/admin.server";
import { getAdminById } from "~/models/admin.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session_admin",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const ADMIN_SESSION_KEY = "adminId";

export async function getAdminSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return await sessionStorage.getSession(cookie);
}

export async function getAdminId(
  request: Request
): Promise<Admin["id"] | undefined> {
  const session = await getAdminSession(request);
  const adminId = session.get(ADMIN_SESSION_KEY);
  return adminId;
}

export async function getAdmin(request: Request) {
  const adminId = await getAdminId(request);
  if (adminId === undefined) return null;

  const admin = await getAdminById(adminId);
  if (admin) return admin;

  throw await logout(request);
}

export async function requireAdminId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const adminId = await getAdminId(request);
  if (!adminId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/admin-login?${searchParams}`);
  }
  return adminId;
}

export async function requireAdmin(request: Request) {
  const adminId = await requireAdminId(request);

  const admin = await getAdminById(adminId);
  if (admin) return admin;

  throw await logout(request);
}

export async function createAdminSession({
  request,
  adminId,
  remember,
  redirectTo,
}: {
  request: Request;
  adminId: string;
  remember: boolean;
  redirectTo: string;
}) {
  console.log('createAdminSession', adminId)
  const session = await getAdminSession(request);
  session.set(ADMIN_SESSION_KEY, adminId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getAdminSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
