// Local AppRouter type stub for Railway deployment
// This avoids the workspace dependency issue

import type { Router } from "@trpc/server"

export type AppRouter = Router<any, any> & {
  // Add your tRPC router types here as needed
  // For now, this is a minimal stub to avoid import errors
  [key: string]: any
}
