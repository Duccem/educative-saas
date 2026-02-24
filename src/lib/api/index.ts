import { ORPCError, os } from "@orpc/server";

import { auth } from "../auth/auth-server";
import { headers } from "next/headers";

export const o = os.$context();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ next }) => {
  const currentHeaders = await headers();

  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const organization = await auth.api.getFullOrganization({
    headers: currentHeaders,
    query: {
      membersLimit: 0,
    },
  });

  return next({
    context: {
      session,
      organization: organization!,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

