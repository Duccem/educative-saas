import {
  emailOTPClient,
  organizationClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "./roles";
export const authClient = createAuthClient({
  plugins: [organizationClient({ ac, roles }), lastLoginMethodClient()],
});

