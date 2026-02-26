import { ChangePasswordForm } from "@/components/sections/auth/change-password";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 w-2/3">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">
          Enter your new password below.
        </h2>
        <p className="text-muted-foreground">
          Your new password must be different from the previous password.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}

