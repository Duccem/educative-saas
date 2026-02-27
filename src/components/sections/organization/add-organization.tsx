"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateOrganizationForm } from "./create-organization-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddOrganization = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={() => (
          <Button className="w-full" variant={"ghost"}>
            <Plus />
            Add Workspace
          </Button>
        )}
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new workspace.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm />
      </DialogContent>
    </Dialog>
  );
};

