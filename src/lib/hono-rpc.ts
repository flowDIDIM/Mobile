import type {
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type {
  ClientRequestOptions,
  ClientResponse,
  InferRequestType,
  InferResponseType,
} from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";

type ClientRequestEndpoint = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  options?: ClientRequestOptions,
) => Promise<ClientResponse<unknown>>;

export interface QueryEndpoint<TEndpoint extends ClientRequestEndpoint> {
  call: TEndpoint;
  queryOptions: (
    args: Omit<
      UseQueryOptions<InferResponseType<TEndpoint, SuccessStatusCode>>,
      "queryKey" | "queryFn"
    > &
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      ({} extends InferRequestType<TEndpoint>
        ? { input?: undefined }
        : { input: InferRequestType<TEndpoint> }),
  ) => {
    queryKey: QueryKey;
    queryFn: (
      opts: QueryFunctionContext,
    ) => Promise<InferResponseType<TEndpoint, SuccessStatusCode>>;
  };
  mutationOptions: (
    args: Omit<
      UseMutationOptions<
        InferResponseType<TEndpoint, SuccessStatusCode>,
        Error,
        InferRequestType<TEndpoint>
      >,
      "mutationKey" | "mutationFn"
    >,
  ) => {
    mutationKey: QueryKey;
    mutationFn: (
      input: InferRequestType<TEndpoint>,
    ) => Promise<InferResponseType<TEndpoint, SuccessStatusCode>>;
  };
}

function createHcQueryEndpoint<TEndpoint extends ClientRequestEndpoint>(
  endpoint: TEndpoint,
  path: string[],
): QueryEndpoint<TEndpoint> {
  return {
    call: endpoint,
    queryOptions(args) {
      const { input, ...rest } = args;
      return {
        ...rest,
        queryKey: buildKey(path, {
          type: "query",
          input: input,
        }),
        queryFn: async ({ signal }) => {
          console.log(`--> GET ${JSON.stringify(input)}`);
          const res = await endpoint(input, { init: { signal } });
          const json = await res.json();

          if (!res.ok) {
            console.log(`<-- ERROR ${res.status} ${JSON.stringify(json)}`);
            throw new Error(`Request failed with status ${res.status}`);
          }

          console.log(`<-- ${res.status}`, JSON.stringify(json));
          return json as InferResponseType<TEndpoint, SuccessStatusCode>;
        },
      };
    },
    mutationOptions(args) {
      return {
        ...args,
        mutationKey: buildKey(path, {
          type: "mutation",
        }),
        mutationFn: async (input) => {
          console.log(`--> POST ${JSON.stringify(input)}`);

          const res = await endpoint(input);
          const json = await res.json();

          if (!res.ok) {
            console.log(`<-- ERROR ${res.status} ${JSON.stringify(json)}`);
            throw new Error(`Request failed with status ${res.status}`);
          }

          console.log(`<-- ${res.status}`, JSON.stringify(json));
          return json as InferResponseType<TEndpoint, SuccessStatusCode>;
        },
      };
    },
  };
}

type QueryClient<T> = {
  [K in keyof T]: T[K] extends ClientRequestEndpoint
    ? QueryEndpoint<T[K]>
    : T[K] extends object
      ? QueryClient<T[K]>
      : T[K];
};

export function hcQuery<T extends object>(obj: T) {
  const createProxy = (target: T, path: string[] = []): QueryClient<T> => {
    return new Proxy(target, {
      get(target, prop, reciever) {
        const value = Reflect.get(target, prop, reciever);
        if (typeof prop !== "string" || prop === "then") {
          return value;
        }

        const nextPath = [...path, prop];
        if (["$get", "$post", "$put", "$delete"].includes(prop)) {
          return createHcQueryEndpoint(
            value as ClientRequestEndpoint,
            nextPath,
          );
        }

        return createProxy(value as T, nextPath);
      },
    }) as QueryClient<T>;
  };

  return createProxy(obj);
}

type KeyType = "query" | "mutation";

interface BuildKeyOptions<TType extends KeyType, TInput> {
  type: TType;
  input?: TType extends "mutation" ? never : TInput;
}

function buildKey<TType extends KeyType, TInput>(
  path: string[],
  opts: BuildKeyOptions<TType, TInput>,
): QueryKey {
  return [
    path,
    { type: opts.type, ...(opts.input !== undefined && { input: opts.input }) },
  ] as const;
}
