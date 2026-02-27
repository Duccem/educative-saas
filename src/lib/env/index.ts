import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    POLAR_ACCESS_TOKEN: z.string(),
    POLAR_SUCCESS_URL: z.string(),
    POLAR_MODE: z.enum(["sandbox", "production"]),
    POLAR_WEBHOOK_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

