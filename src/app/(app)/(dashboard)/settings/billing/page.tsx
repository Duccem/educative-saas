import InvoiceList from "@/components/sections/billing/invoice-list";
import { SubscriptionStatus } from "@/components/sections/billing/subscription-status";
import { Usage } from "@/components/sections/billing/usage";
import { requireAuth } from "@/lib/auth/guards";

export default async function BillingPage() {
  await requireAuth();

  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold leading-none">Billing</h1>
        <p className=" text-muted-foreground">Manage your billing settings.</p>
      </div>
      <SubscriptionStatus />
      <Usage />
      <InvoiceList />
    </div>
  );
}

