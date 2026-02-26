import { redirect } from "next/navigation";
import { getSession } from "./get-session";
import { auth } from "./auth-server";
import { headers } from "next/headers";

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in" as any);
  }

  return session;
}

export async function requireAnon() {
  const session = await getSession();

  if (session) {
    return redirect("/dashboard" as any);
  }

  return null;
}

export async function indexProtection() {
  const session = await getSession();

  if (session) {
    return redirect("/dashboard" as any);
  }

  return null;
}

export async function requireOrganizations() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (organizations.length === 0) {
    return redirect("/new-organization" as any);
  }

  return null;
}

export async function requireNoOrganizations() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (organizations.length > 0) {
    return redirect("/dashboard" as any);
  }
  return null;
}

