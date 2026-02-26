export default function Page() {
  return (
    <div className="flex flex-col gap-6 w-2/3">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">
          Check your email for the password reset link.
        </h2>
        <p className="text-muted-foreground">
          We sent to your email address a link to reset your password. Please
          check your inbox and click on the link to set a new password. If you
          don't see the email, check your spam folder or try again. The link
          will expire in 10 minutes.
        </p>
      </div>
    </div>
  );
}

