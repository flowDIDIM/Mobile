import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",

  client: {
    EXPO_PUBLIC_API_URL: z.url().min(1, "API URL is required"),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
