import { SignUpForm } from "@/components/sections/auth/sign-up-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 w-2/3">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">Create Account</h2>
        <p className="text-muted-foreground">
          Create a new account to get started with AcadAI.
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}

