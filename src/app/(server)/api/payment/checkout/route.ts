import { env } from "@/lib/env";
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN!,
  server: env.POLAR_MODE as "sandbox" | "production",
  successUrl: env.POLAR_SUCCESS_URL!,
  returnUrl: env.POLAR_SUCCESS_URL!,
  theme: "dark",
});

