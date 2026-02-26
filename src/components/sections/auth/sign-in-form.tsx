"use client";
import { Facebook } from "@/components/icons/facebook";
import { Google } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackURL = searchParams.get("callbackURL");
  const [rememberMe, setRememberMe] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push((callbackURL as any) || "/home");
          },
          onError: (error) => {
            console.error("Sign-in error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred during sign-in. Please try again.",
            );
          },
        },
      );
    },
  });

  const oauthSignIn = async (provider: "google" | "facebook") => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error("OAuth sign-in error:", error);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      id="sign-in-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your email"
                />
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your email"
                  type="password"
                />
              </Field>
            );
          }}
        </form.Field>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="rounded border-gray-300 cursor-pointer"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
            />
            <Label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember Me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-primary">
            Forgot Your Password?
          </Link>
        </div>
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
                "Sign In"
              )}
            </Button>
          )}
        </form.Subscribe>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or Login With
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="cursor-pointer gap-4 items-center"
            onClick={() => oauthSignIn("google")}
          >
            <Google />
            Google
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer gap-4 items-center"
            onClick={() => oauthSignIn("facebook")}
          >
            <Facebook />
            Facebook
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don't Have An Account?{" "}
          <Link href={"/sign-up"} className="text-primary hover:underline">
            Register Now.
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
};

