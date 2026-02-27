"use client";

import { Check, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

type Plan = {
  id: "free" | "basic" | "complete";
  title: string;
  price: string;
  description: string;
  features: string[];
  productId?: string;
};

const plans: Plan[] = [
  {
    title: "Clinic",
    price: "$9.99/month",
    features: [
      "100 users maximum",
      "100 GB storage",
      "Advanced appointment scheduling",
      "Laboratory management",
      "Pharmacy management",
      "Medical records management",
      "Priority email support",
      "Basic analytics",
    ],
    id: "basic",
    productId: "f36c67f6-4d6c-4522-b954-cd6c97b01be0",
    description:
      "For persons that want to manage all of their healthcare needs.",
  },
  {
    title: "Complete",
    price: "$24.99/month",
    features: [
      "Unlimited users",
      "1 TB storage",
      "Comprehensive appointment scheduling",
      "Laboratory management",
      "Pharmacy management",
      "Medical records management",
      "Billing and invoicing",
      "Advanced analytics and reporting",
      "Phone and email support",
    ],
    id: "complete",
    productId: "e17755b0-0e97-41d9-a7fc-ad3ed0dd36ae",
    description: "For families or small hospitals that need full features.",
  },
];

export default function PricesSheet() {
  const { data } = authClient.useSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("free");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    try {
      router.replace(
        `/api/payments/checkout?products=${selectedPlan}&customerExternalId=${data?.user.id ?? ""}`,
      );
    } catch (error) {
      toast.error("Failed to initiate checkout. Please try again.");
      console.error("Checkout error:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Upgrade to Pro</Button>} />
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose your plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs and start enjoying the
            benefits of our service.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={selectedPlan ?? ""}
          onValueChange={setSelectedPlan}
          className="grid  grid-cols-2 gap-4 py-4"
        >
          {plans.map((plan) => {
            return (
              <div key={plan.id} className="relative h-full">
                <RadioGroupItem
                  value={plan.productId ?? ""}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className={`flex flex-col sm:flex-row items-start p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5  h-full`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold">
                        {plan.title}
                      </div>
                      <div className="text-base font-bold text-primary">
                        {plan.price}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <Check className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <DialogFooter>
          <Button
            disabled={!selectedPlan}
            className="w-full sm:w-auto"
            onClick={handleSubscribe}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PricesSheet };

