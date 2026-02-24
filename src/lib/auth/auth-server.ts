import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../database";
import * as schema from "../database/schema/auth";
import { env } from "../env";
import {
  bearer,
  emailOTP,
  lastLoginMethod,
  openAPI,
  organization,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "./roles";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
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
      sendInvitationEmail: async ({ email, role }) => {
        console.log(`Sended to ${email} the invitation for role ${role}`);
      },
      organizationHooks: {
        afterCreateOrganization: async ({ organization, user, member }) => {
          console.log(
            `User ${user.id} created the organization ${organization.id} with role ${member.role}`,
          );
        },
        afterAcceptInvitation: async ({ organization, user, member }) => {
          console.log(
            `User ${user.id} accepted the invitation for organization ${organization.id} with role ${member.role}`,
          );
        },
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      sendVerificationOnSignUp: true,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp, type }) =>
        console.log(`Sended to ${email} the code ${otp} for operation ${type}`),
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

