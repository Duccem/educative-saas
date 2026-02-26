"use client";

import { useState } from "react";
import z from "zod";
import slugify from "slugify";
import { OrganizationImagePicker } from "./organization-image-picker";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
});
export const CreateOrganizationForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.organization.create(
        {
          name: value.name,
          slug: slugify(value.name.toLowerCase()),
          keepCurrentActiveOrganization: false,
        },
        {
          onSuccess: () => {
            toast.success("Organization created successfully");
            router.push("/home");
          },
          onError: (error) => {
            console.error("Organization creation error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred while creating the organization. Please try again.",
            );
          },
        },
      );
    },
  });

  return (
    <form
      action=""
      className="flex flex-col w-full gap-4 mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <OrganizationImagePicker onFileSelect={setFile} />
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Organization`s name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder=""
                />
              </Field>
            );
          }}
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
              "Create Organización"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

