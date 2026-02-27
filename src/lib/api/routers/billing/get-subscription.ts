import { polar } from "@/lib/payments/client";
import { protectedProcedure } from "../..";

export const statusSubscription = protectedProcedure
  .route({ method: "GET", path: "/" })
  .errors({
    NotOrganizationMember: {
      status: 403,
      message: "User is not a member of an organization",
    },
  })
  .handler(async ({ context: { organization }, errors }) => {
    if (!organization) {
      throw errors.NotOrganizationMember();
    }

    const state = await polar.customers.getStateExternal({
      externalId: organization.id,
    });
    return { state };
  });
