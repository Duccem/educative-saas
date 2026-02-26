"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export const AuthBackButton = () => {
  const pathName = usePathname();

  if (pathName === "/sign-in") {
    return null;
  }
  return (
    <Button>
      <ArrowLeft /> Back
    </Button>
  );
};

