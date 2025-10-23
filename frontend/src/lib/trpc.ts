// Type-only import that works in both local dev and Railway deployment
// In local dev, this resolves to the actual backend AppRouter
// In Railway, this uses the stub from shared package
import type { AppRouter } from "@construct-flow/backend"
import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "http://localhost:3333/trpc"
    })
  ]
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})
