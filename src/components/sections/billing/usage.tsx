"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const PLAN_DATA = {
  free: {
    students: {
      limit: 100,
      disabled: false,
      unlimited: false,
    },
    grades: {
      limit: 10,
      disabled: false,
      unlimited: false,
    },
    ai_usage: {
      limit: 100_000,
      disabled: true,
      unlimited: false,
    },
  },
  basic: {
    students: {
      limit: 500,
      disabled: false,
      unlimited: false,
    },
    grades: {
      limit: 20,
      disabled: false,
      unlimited: false,
    },
    ai_usage: {
      limit: 100_000_000,
      disabled: false,
      unlimited: false,
    },
  },
  complete: {
    students: {
      limit: 1000,
      disabled: false,
      unlimited: true,
    },
    grades: {
      limit: 100,
      disabled: false,
      unlimited: false,
    },
    ai_usage: {
      limit: 100_000,
      disabled: false,
      unlimited: true,
    },
  },
} as const;

export const products = [
  {
    productId: "e17755b0-0e97-41d9-a7fc-ad3ed0dd36ae",
    id: "complete",
    name: "Enterprise Plan",
  },
  {
    productId: "f36c67f6-4d6c-4522-b954-cd6c97b01be0",
    id: "basic",
    name: "Pro Plan",
  },
  {
    productId: "f4b5210a-6677-4de4-a0ec-249d18079b43",
    slug: "free",
    name: "Free Plan",
  },
];

interface UsageItemProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  period?: string;
  percentage?: number;
  unlimited?: boolean;
  disabled?: boolean;
}

function CircularProgress({ value }: { value: number }) {
  return (
    <div className="relative h-6 w-6 flex items-center justify-center">
      <svg className="h-6 w-6" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          className="stroke-muted fill-none"
          cx="18"
          cy="18"
          r="16"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          className="stroke-primary fill-none"
          cx="18"
          cy="18"
          r="16"
          strokeWidth="4"
          strokeDasharray={`${value * 0.01 * 100.53} 100.53`}
          strokeDashoffset="0"
          transform="rotate(-90 18 18)"
        />
      </svg>
    </div>
  );
}

function UsageItem({
  label,
  current,
  max,
  unit,
  period,
  percentage,
  unlimited,
  disabled,
}: UsageItemProps) {
  // Calculate percentage if not explicitly provided
  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : Math.min((current / max) * 100, 100);

  // Format values differently based on whether we have a unit or not
  let formattedCurrent: string;
  let formattedMax: string;

  if (unit) {
    // For values with units (like GB), show the decimal value
    formattedCurrent = current.toFixed(1).replace(/\.0$/, "");
    formattedMax = max.toFixed(1).replace(/\.0$/, "");
  } else {
    // For counts without units, use k formatting for large numbers
    formattedCurrent =
      current >= 1000 ? `${(current / 1000).toFixed(1)}k` : current.toString();

    if (max >= 1000000) {
      // If max is large, format it as well
      formattedMax = `${(max / 1000000).toFixed(0)}M`;
    } else if (max >= 1000) {
      formattedMax = `${(max / 1000).toFixed(0)}k`;
      // If max is very large, format it as millions
    } else {
      formattedMax = max.toString();
    }
  }

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-4">
        <CircularProgress
          value={disabled ? 0 : unlimited ? 0 : calculatedPercentage}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {unlimited && !disabled && (
        <span className="text-sm text-muted-foreground">Ilimitados</span>
      )}
      {!unlimited && !disabled && (
        <div className="text-sm text-muted-foreground">
          {formattedCurrent} / {formattedMax} {unit}{" "}
          {period && <span>per {period}</span>}
        </div>
      )}
      {disabled && (
        <div className="text-sm text-muted-foreground">
          <span className="line-through">
            {formattedCurrent} / {formattedMax} {unit}
          </span>{" "}
          (Upgrade to enable)
        </div>
      )}
    </div>
  );
}

export function Usage() {
  const { data, isPending } = useQuery({
    queryKey: ["organization-usage-meters"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/billing/");
      const data = await response.json();
      const subscription = data?.state.activeSubscriptions?.[0] || null;

      if (!subscription) {
        return {
          plan: "free",
          meters: {
            students: 15,
            grades: 5,
            ai_usage: 0,
          },
          limits: PLAN_DATA["free"],
        };
      }

      const plan = products.find(
        (p) => p.productId === subscription?.productId,
      );
      return {
        plan: plan?.name || "free",
        meters: {
          students: 15,
          grades: 5,
          ai_usage: 25000,
        },
        limits: PLAN_DATA[plan?.id as keyof typeof PLAN_DATA],
      };
    },
  });

  if (isPending) {
    return <UsageSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-medium leading-none tracking-tight mb-4">
        Usage
      </h2>
      <Card className="divide-y ">
        <UsageItem
          label="Maximun students"
          current={data.meters?.students ?? 0}
          max={data.limits.students.limit}
          disabled={data.limits.students.disabled}
          unlimited={data.limits.students.unlimited}
          period="month"
        />
        <UsageItem
          label="Maximun grades"
          current={data.meters?.grades ?? 0}
          max={data.limits.grades.limit}
          disabled={data.limits.grades.disabled}
          unlimited={data.limits.grades.unlimited}
          period="month"
        />
        <UsageItem
          label="AI Usage"
          current={data.meters?.ai_usage ?? 0}
          max={data.limits.ai_usage.limit}
          disabled={data.limits.ai_usage.disabled}
          unlimited={data.limits.ai_usage.unlimited}
          period="month"
        />
      </Card>
    </div>
  );
}

export function UsageSkeleton() {
  // Define labels to use for keys instead of array indices
  const skeletonItems = ["users", "connections", "inbox"];

  return (
    <div>
      <h2 className="text-lg font-medium leading-none tracking-tight mb-4">
        Usage
      </h2>

      <Card className="divide-y">
        {skeletonItems.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-3 px-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </Card>
    </div>
  );
}

