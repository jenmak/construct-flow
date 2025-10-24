// Type-only import that works in both local dev and Railway deployment
// In local dev, this resolves to the actual backend AppRouter
// In Railway, this uses the stub from shared package
import type { AppRouter } from "../types/trpc"
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

// Get API URL from environment or use default
const getApiUrl = () => {
  // In production (Railway), use the environment variable
  if (import.meta.env.VITE_CONSTRUCT_FLOW_API_URL) {
    return import.meta.env.VITE_CONSTRUCT_FLOW_API_URL
  }

  // In development, use localhost
  return "http://localhost:3333/trpc"
}

// Create a mock client for Railway deployment
const createMockClient = () => {
  return {
    projects: {
      get: {
        queryOptions: (input: { id: string }) => ({
          queryKey: ["projects", "get", input.id],
          queryFn: async () => {
            // Return mock data for Railway deployment
            const { mockProject } = await import("../mockData")
            return mockProject
          }
        })
      },
      list: {
        queryOptions: () => ({
          queryKey: ["projects", "list"],
          queryFn: async () => {
            const { mockProjects } = await import("../mockData")
            return mockProjects
          }
        })
      },
      create: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock create project:", data)
            return { id: "mock-new-project" }
          }
        })
      },
      delete: {
        useMutation: () => ({
          mutate: async (id: string) => {
            console.log("Mock delete project:", id)
            return { success: true }
          }
        })
      },
      submitQuestionnaire: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock submit questionnaire:", data)
            return { success: true }
          }
        })
      }
    },
    questionnaire: {
      getQuestionnaireOptions: {
        queryOptions: (input: any) => ({
          queryKey: ["questionnaire", "options", input],
          queryFn: async () => {
            const { mockQuestionnaireOptions } = await import("../mockData")
            return mockQuestionnaireOptions
          }
        })
      },
      getPermitRequirements: {
        queryOptions: (input: any) => ({
          queryKey: ["questionnaire", "permitRequirements", input],
          queryFn: async () => {
            return {
              type: "NoReview",
              title: "No Permit Required",
              description: "Nothing is required! You're set to build.",
              details: ["Nothing is required! You're set to build."]
            }
          }
        })
      }
    }
  }
}

// Always use mock client for Railway deployment
// This ensures the app works without a backend connection
const createMockTrpc = () => {
  return {
    projects: {
      get: {
        queryOptions: (input: { id: string }) => ({
          queryKey: ["projects", "get", input.id],
          queryFn: async () => {
            const { mockProject } = await import("../mockData")
            return mockProject
          }
        })
      },
      list: {
        queryOptions: () => ({
          queryKey: ["projects", "list"],
          queryFn: async () => {
            const { mockProjects } = await import("../mockData")
            return mockProjects
          }
        })
      },
      create: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock create project:", data)
            return { id: "mock-new-project" }
          }
        })
      },
      delete: {
        useMutation: () => ({
          mutate: async (id: string) => {
            console.log("Mock delete project:", id)
            return { success: true }
          }
        })
      },
      submitQuestionnaire: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock submit questionnaire:", data)
            return { success: true }
          }
        })
      },
      getPermitRequirements: {
        queryOptions: (input: { projectId: string }) => ({
          queryKey: ["projects", "permitRequirements", input.projectId],
          queryFn: async () => {
            return {
              type: "NoReview",
              title: "No Permit Required",
              description: "Nothing is required! You're set to build.",
              details: ["Nothing is required! You're set to build."]
            }
          }
        })
      }
    },
    questionnaire: {
      getQuestionnaireOptions: {
        queryOptions: (input: any) => ({
          queryKey: ["questionnaire", "options", input],
          queryFn: async () => {
            const { mockQuestionnaireOptions } = await import("../mockData")
            return mockQuestionnaireOptions
          }
        })
      },
      getPermitRequirements: {
        queryOptions: (input: any) => ({
          queryKey: ["questionnaire", "permitRequirements", input],
          queryFn: async () => {
            return {
              type: "NoReview",
              title: "No Permit Required",
              description: "Nothing is required! You're set to build.",
              details: ["Nothing is required! You're set to build."]
            }
          }
        })
      }
    }
  }
}

// Use mock client for Railway deployment
export const trpcClient = createMockClient() as any
export const trpc = createMockTrpc() as any
