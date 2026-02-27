"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const DeleteOrganization = () => {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.organization.delete({
        organizationId: activeOrg?.id ?? "",
      });
      router.push("/dashboard" as any);
    },
  });
  return (
    <Card className="border-destructive">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-destructive">Delete Workspace</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            workspace and all of its data.
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger
            render={<Button variant="destructive">Delete Account</Button>}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete the workspace?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                workspace
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />

              <Button variant={"destructive"} onClick={() => mutate()}>
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Delete Workspace"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Once you delete the workspace, there is no going back. Please be
          certain.
        </p>
      </CardContent>
    </Card>
  );
};

