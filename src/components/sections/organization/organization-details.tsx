"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Organization } from "better-auth/plugins";
import { Camera, Loader2, Save, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useUploadThing } from "@/lib/storage/utils";

export const OrganizationDetails = () => {
  const { data, isPending, refetch } = authClient.useActiveOrganization();
  if (isPending) {
    return <OrganizationDetailsSkeleton />;
  }

  if (!data) {
    return <OrganizationDetailsSkeleton />;
  }
  return <OrganizationDetailsForm organization={data} refetch={refetch} />;
};

export const OrganizationDetailsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading organization...</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </CardContent>
    </Card>
  );
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.url(),
});

type OrganizationDetailsFormProps = {
  organization: Organization;
  refetch?: VoidFunction;
};

export const OrganizationDetailsForm = ({
  organization,
  refetch,
}: OrganizationDetailsFormProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { startUpload } = useUploadThing("organizationLogo");
  const form = useForm({
    defaultValues: {
      name: organization.name,
      logo: organization.logo ?? "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      let logoUrl = "";
      if (file) {
        const res = await startUpload([file]);
        if (res) {
          logoUrl = res[0].ufsUrl;
        }
      }
      await authClient.organization.update(
        {
          data: {
            name: value.name,
          },
          organizationId: organization.id,
        },
        {
          onSuccess: () => {
            toast.success("Organization updated successfully");
            refetch?.();
          },
          onError: (ctx) => {
            toast.error(`Error updating organization: ${ctx.error.message}`);
          },
        },
      );
    },
  });

  const onSelectFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Selecciona una imagen válida");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    form.setFieldValue("logo", url);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(e);
      }}
      className="flex flex-col w-full gap-4 mt-6"
    >
      <Card>
        <CardHeader className="flex items-start justify-between">
          <div>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>
              Manage your profile information and avatar
            </CardDescription>
          </div>
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {" "}
                    <Save /> {"Save Changes"}
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-4">
            <Label>Profile picture</Label>
            <form.Subscribe>
              {(state) => (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className={cn(
                      "relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors",
                    )}
                    onClick={() => fileRef.current?.click()}
                  >
                    {state.values.logo !== "" ? (
                      <>
                        <img
                          alt="Profile avatar"
                          className="object-cover"
                          src={state.values.logo}
                        />
                      </>
                    ) : (
                      <Camera className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={() => fileRef.current?.click()}
                        type="button"
                        variant="outline"
                      >
                        <Camera className="size-4" />
                        {state.values.logo ? "Change Photo" : "Upload Photo"}
                      </Button>
                      {state.values.logo && (
                        <Button
                          onClick={() => {
                            setFile(null);
                            form.setFieldValue("logo", "");
                          }}
                          type="button"
                          variant="outline"
                        >
                          <X className="size-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Click the circle to upload a profile picture. Supported
                      formats: JPG, PNG, GIF. Max size 5MB.
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      onSelectFile(selectedFile);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
            </form.Subscribe>
          </div>
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
        </CardContent>
      </Card>
    </form>
  );
};

