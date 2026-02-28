import { User } from "better-auth";
import { Organization } from "better-auth/plugins";
import { polar } from "../payments/client";
import { products } from "../payments/products";

export async function organizationCreated(organization: Organization) {
  await polar.customers.create({
    externalId: organization.id,
    email: `${organization.name.split(" ")[0]}@email.com`,
    name: organization.name,
  });
  await polar.subscriptions.create({
    externalCustomerId: organization.id,
    productId: products[0].productId,
  });
}
export async function invitationSent(email: string, role: string, invitationId: string) {
  console.log(`Sended to ${email} the invitation for role ${role} with token ${invitationId}`);
}
export async function invitationAccepted(organization: Organization, user: User) {
  console.log(`User ${user.name} accepted the invitation for organization ${organization.name}`);
}
export async function sendResetPasswordEmail(email: string, url: string, token: string) {
  console.log(`Send to ${email} the reset password link: ${url}?token=${token}`);
}

