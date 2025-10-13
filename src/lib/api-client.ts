import { env } from "@/env";

import type { AppType } from "../../../DIDIM-Server/src/app";
import { hc } from "hono/client";
import { hcQuery } from "@/lib/hono-rpc";
import { authClient } from "@/lib/auth-client";

export const client = hc<AppType>(env.EXPO_PUBLIC_API_URL, {
  headers: () => {
    const cookies = authClient.getCookie();

    return {
      Cookie: cookies,
    };
  },
});
export const clientQuery = hcQuery(client);
