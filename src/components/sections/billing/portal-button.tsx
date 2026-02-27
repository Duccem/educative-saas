"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const PortalButton = () => {
  const router = useRouter();
  return (
    <Button
      className="h-9"
      variant={"outline"}
      onClick={() => {
        router.replace("/api/payments/portal");
      }}
    >
      Manage
    </Button>
  );
};
