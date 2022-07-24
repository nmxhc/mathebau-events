import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { Admin } from "~/models/admin.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isAdmin(admin: any): admin is Admin {
  return admin && typeof admin === "object" && typeof admin.email === "string" && typeof admin.name === "string";
}

export function useOptionalAdmin(): Admin | undefined {
  const data = useMatchesData("root");
  if (!data || !isAdmin(data.admin)) {
    return undefined;
  }
  return data.admin;
}

export function useAdmin(): Admin {
  const maybeAdmin = useOptionalAdmin();
  if (!maybeAdmin) {
    throw new Error(
      "No admin found in root loader, but admin is required by useAdmin. If admin is optional, try useOptionalAdmin instead."
    );
  }
  return maybeAdmin;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function datePlusDays (date: string, days: number) : string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function dateToString (date: Date) : string {
  return date.toISOString().split('T')[0];
}

export function dateTimePlusMinutes (date: Date, minutes: number) : Date {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}
