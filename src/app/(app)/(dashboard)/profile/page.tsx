import AccountForm from "@/components/sections/proile/account-form";
import { requireAuth } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold leading-none">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and billing settings.
        </p>
      </div>
      <AccountForm />
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Preferences />
        <Notifications />
      </div>
      <DeleteAccount /> */}
    </div>
  );
}

