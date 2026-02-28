import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../database";
import * as schema from "../database/schema/auth";
import { env } from "../env";
import { bearer, lastLoginMethod, openAPI, organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "./roles";
import { invitationAccepted, invitationSent, organizationCreated, sendResetPasswordEmail } from "./hooks";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ token, url, user }) => sendResetPasswordEmail(user.email, url, token),
    resetPasswordTokenExpiresIn: 60 * 10,
    revokeSessionsOnPasswordReset: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    organization({
      ac,
      roles,
      creatorRole: "admin",
      sendInvitationEmail: async ({ email, role, invitation }) => invitationSent(email, role, invitation.id),
      organizationHooks: {
        afterCreateOrganization: async ({ organization }) => organizationCreated(organization),
        afterAcceptInvitation: async ({ organization, user }) => invitationAccepted(organization, user),
      },
    }),
    nextCookies(),
    lastLoginMethod(),
    bearer(),
    openAPI(),
  ],
});

export type BetterSession = typeof auth.$Infer.Session;
export type BetterUser = typeof auth.$Infer.Session.user;
export type BetterOrganization = typeof auth.$Infer.Organization;

