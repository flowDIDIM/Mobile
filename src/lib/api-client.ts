import { env } from "@/env";

import { authClient } from "@/lib/auth-client";
import { hcWithType } from "../../../DIDIM-Server/dist/app";

export const client = hcWithType(env.EXPO_PUBLIC_API_URL, {
  headers: () => {
    const cookies = authClient.getCookie();

    return {
      Cookie: cookies,
    };
  },
});
