"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import PricesSheet from "./prices-sheet";
import { PortalButton } from "./portal-button";
import { Calendar, Check } from "lucide-react";
import { format } from "date-fns";

const products = [
  {
    productId: "",
    name: "Free",
    price: "Free",
  },
  {
    productId: "",
    name: "Professional",
    price: "$24.99/month",
  },
  {
    productId: "",
    name: "Enterprise",
    price: "$59.99/month",
  },
];

export const SubscriptionStatus = () => {
  const { data, isPending } = useQuery({
    queryKey: ["billing-state"],
    initialData: null,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/billing/");
      const data = await response.json();
      return data?.state.activeSubscriptions?.[0] ?? null;
    },
  });

  if (isPending) {
    return <SubscriptionStatusSkeleton />;
  }

  return <SubscriptionActive subscription={data} />;
};

export const SubscriptionStatusSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
      </CardHeader>
    </Card>
  );
};

const benefits = [
  "500 students maximum",
  "+20 grades and sections",
  "Online classroom access",
  "Priority support",
  "Access to Lara Agent AI assistant",
];

const SubscriptionActive = ({ subscription }: { subscription: any }) => {
  const selectedPlan =
    products.find((p) => p.productId === subscription?.productId) ??
    products[0];
  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className="font-bold text-xl">
              {selectedPlan?.name ?? "Unknown Plan"}
            </span>
            <span className="rounded-md px-1 py-0.5 bg-emerald-500/20 border border-emerald-500 text-emerald-500 text-xs">
              Active
            </span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {selectedPlan?.price ?? "Free"}
          </div>
        </div>
        {selectedPlan?.name === "Free" ? <PricesSheet /> : <PortalButton />}
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="w-full py-4 border-y">
            <p className="flex items-center gap-2">
              <Calendar className="size-4 text-neutral-500" />
              Next billing date
            </p>
            <p className="text-sm text-neutral-400">
              {format(
                new Date(subscription?.currentPeriodEnd ?? new Date()),
                "MMMM dd, yyyy",
              )}
            </p>
          </div>
        ) : null}
        {selectedPlan?.name === "Free" ? (
          <div className="w-full py-4 border-t space-y-2">
            <p className="wrap-break-word   font-semibold">
              What you`ll get if you upgrade:
            </p>
            {benefits.slice(0, 3).map((benefit, index) => (
              <div className="flex items-center gap-1" key={index}>
                <Check className="size-3.5" />
                <span className="wrap-break-word text-sm font-light">
                  {benefit}
                </span>
              </div>
            ))}
            {benefits.length > 3 && (
              <span className="text-muted-foreground">
                +{benefits.length - 3} more
              </span>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

