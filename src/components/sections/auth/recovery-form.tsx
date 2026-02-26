"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email(),
});

export const RecoveryForm = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: `${window.location.origin}/change-password`,
        },
        {
          onError: (error) => {
            console.error("Password reset error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred while requesting password reset. Please try again.",
            );
          },
          onSuccess: () => {
            router.push("/check-email");
          },
        },
      );
    },
  });

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter your email"
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <form.Subscribe>
        {(state) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!state.canSubmit || state.isSubmitting}
          >
            {state.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send reset code"
            )}
          </Button>
        )}
      </form.Subscribe>
      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href={"/sign-in"} className="text-primary hover:underline">
          Back to sign in.
        </Link>
      </div>
    </form>
  );
};

