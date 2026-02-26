import { RecoveryForm } from "@/components/sections/auth/recovery-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 w-2/3">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">Forgot your password?</h2>
        <p className="text-muted-foreground">
          What email address do you use to sign in? We will send you a password
          reset link.
        </p>
      </div>
      <RecoveryForm />
    </div>
  );
}

