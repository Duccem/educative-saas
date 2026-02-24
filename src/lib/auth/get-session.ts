import { headers } from "next/headers";
import { cache } from "react";
import { auth, BetterSession } from "./auth-server";

export const getSession = cache(async (): Promise<BetterSession | null> => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

