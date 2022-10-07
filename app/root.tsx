import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getAdmin, getAdminSession } from "./session_admin.server";
import { Layout } from './components/Layout';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Mathebau Events",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  admin: Awaited<ReturnType<typeof getAdmin>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getAdminSession(request);
  console.log("Root loader", session.get("adminId"), session.has("globalMessage"));
  return json<LoaderData>({
    admin: await getAdmin(request),
  });
};

export default function App() {
  return (
    <html lang="de" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Layout>
          <Outlet />
        </Layout>
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
