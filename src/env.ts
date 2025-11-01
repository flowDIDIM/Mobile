import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",

  client: {
    EXPO_PUBLIC_API_URL: z.url().min(1, "API URL is required"),
  },

  runtimeEnvStrict: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
});
