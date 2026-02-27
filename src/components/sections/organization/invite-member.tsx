"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import z from "zod";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});
const InviteMember = () => {
  const { data, isPending } = authClient.useActiveOrganization();
  const form = useForm({
    defaultValues: {
      email: "",
      role: "member",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.organization.inviteMember(
        {
          organizationId: data?.id ?? "",
          email: value.email,
          role: value.role as
            | "superadmin"
            | "admin"
            | "teacher"
            | "student"
            | "parent",
        },
        {
          onSuccess: () => {
            formApi.reset();
          },
        },
      );
    },
  });

  if (isPending || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>
          Invite a new member to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="w-full flex flex-col  justify-between gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <FieldGroup className="flex items-center gap-3 flex-row">
            <form.Field name="email">
              {(field) => (
                <Field>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="doe@example.com"
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <div className="">
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? "admin")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Role"} />
                    </SelectTrigger>
                    <SelectContent align="start" side="top">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Profesor</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="parent">Padre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </FieldGroup>
          <div>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  className=""
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InviteMember;

