import { env } from "@/env";

import type { AppType } from "../../../DIDIM-Server/src/app";
import { hc } from "hono/client";
import { hcQuery } from "@/lib/hono-rpc";

export const client = hc<AppType>(env.EXPO_PUBLIC_API_URL);
export const clientQuery = hcQuery(hc<AppType>(env.EXPO_PUBLIC_API_URL));
