import { polar } from "@/lib/payments/client";
import { protectedProcedure } from "../..";

export const initSubscription = protectedProcedure
  .route({ method: "POST", path: "/" })
  .errors({
    NotOrganizationMember: {
      status: 403,
      message: "User is not a member of an organization",
    },
  })
  .handler(async ({ context: { user, organization }, errors }) => {
    if (!organization) {
      throw errors.NotOrganizationMember();
    }
    await polar.customers.create({
      externalId: organization.id,
      email: user.email,
      name: organization.name,
    });
  });

