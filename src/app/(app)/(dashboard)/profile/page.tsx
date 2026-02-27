import AccountForm from "@/components/sections/profile/account-form";
import { ChangePassword } from "@/components/sections/profile/change-password";
import { DeleteAccount } from "@/components/sections/profile/delete-account";
import { Notifications } from "@/components/sections/profile/notifications";
import { Preferences } from "@/components/sections/profile/preferences";
import { requireAuth } from "@/lib/auth/guards";

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold leading-none">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and billing settings.
        </p>
      </div>
      <AccountForm />
      <ChangePassword />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Preferences />
        <Notifications />
      </div>
      <DeleteAccount />
    </div>
  );
}

