import { env } from "@/env";

import type { AppType } from "../../../DIDIM-Server/src/app";
import { hc } from "hono/client";

export const client = hc<AppType>(env.EXPO_PUBLIC_API_URL);
