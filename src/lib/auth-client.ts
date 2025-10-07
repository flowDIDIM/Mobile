import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "http://127.0.0.1:3000", // Base URL of your Better Auth backend.
    plugins: [
        expoClient({
            scheme: "didim",
            storagePrefix: "didim",
            storage: SecureStore,
        })
    ]
});