"use client";
import { Camera, Loader2, Save, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/lib/storage/utils";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("Email inválido"),
  image: z.url(),
});

export default function AccountForm() {
  const { data: session, isPending } = authClient.useSession();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { startUpload } = useUploadThing("userAvatar", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl ?? null;
      if (url) {
        toast.success("Avatar actualizado");
      }
    },
    onUploadError: (err) => {
      console.error(err);
      toast.error("Error al subir el avatar");
    },
  });

  const form = useForm({
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
      image: session?.user.image || "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      let imageUrl = value.image ?? "";
      if (file) {
        const res = await startUpload([file]);
        imageUrl = res?.[0]?.ufsUrl ?? imageUrl;
      }
      await authClient.updateUser(
        {
          name: value.name,
          image: imageUrl || undefined,
        },
        {
          onError: (err) => {
            console.error("Failed to update user", err);
            toast.error("No se pudo actualizar el perfil");
          },
          onSuccess: () => {
            toast.success("Perfil actualizado");
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
    form.setFieldValue("image", url);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(e);
      }}
    >
      <Card>
        <CardHeader className="flex items-start justify-between">
          <div>
            <CardTitle>Profile settings</CardTitle>
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
        <CardContent className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4">
            <Label>Profile picture</Label>
            <form.Subscribe>
              {(state) => (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className={cn(
                      "relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors",
                    )}
                    onClick={() => inputRef.current?.click()}
                  >
                    {state.values.image !== "" ? (
                      <>
                        <img
                          alt="Profile avatar"
                          className="object-cover"
                          src={state.values.image}
                        />
                      </>
                    ) : (
                      <Camera className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={() => inputRef.current?.click()}
                        type="button"
                        variant="outline"
                      >
                        <Camera className="size-4" />
                        {state.values.image ? "Change Photo" : "Upload Photo"}
                      </Button>
                      {state.values.image && (
                        <Button
                          onClick={() => {
                            setFile(null);
                            form.setFieldValue("image", "");
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
                    ref={inputRef}
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
          <div className="flex flex-col gap-4 w-full">
            <form.Field name="email">
              {(field) => (
                <Field className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    disabled
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="name">
              {(field) => (
                <Field className="space-y-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </Field>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

