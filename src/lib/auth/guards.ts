import { redirect } from "next/navigation";
import { getSession } from "./get-session";

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

