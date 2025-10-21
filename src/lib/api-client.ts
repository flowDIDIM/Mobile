import { env } from "@/env";

import { authClient } from "@/lib/auth-client";
import { type AppType } from "../../../DIDIM-Server/dist/app";
import { hc } from "hono/client";

export const client = hc<AppType>(env.EXPO_PUBLIC_API_URL, {
  headers: () => {
    const cookies = authClient.getCookie();

    return {
      Cookie: cookies,
    };
  },
});
