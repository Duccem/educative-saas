import { AlertTriangleIcon } from "lucide-react";
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

export const DeleteAccount = () => {
  return (
    <Card className="border-destructive">
      <CardHeader className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 size-9 rounded-lg bg-destructive/30 flex items-center justify-center">
              <AlertTriangleIcon className="size-4 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger
            render={<Button variant="destructive">Delete Account</Button>}
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete your account?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />

              <Button variant="destructive">Yes, delete my account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
      </CardContent>
    </Card>
  );
};
