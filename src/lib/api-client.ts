import axios from "axios";
import { authClient } from "./auth-client";
import { env } from "@/env";

const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await authClient.getSession();

    if (session?.data?.session?.token) {
      config.headers.Authorization = `Bearer ${session.data.session.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authClient.signOut();
    }
    return Promise.reject(error);
  },
);

export { apiClient };
