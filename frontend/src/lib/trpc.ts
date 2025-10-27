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

// Create real tRPC client for development
const createRealTrpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink(),
      httpBatchLink({
        url: getApiUrl()
      })
    ]
  })
}

// Create real tRPC for React Query integration
const createRealTrpc = () => {
  return createTRPCOptionsProxy<AppRouter>({
    client: createRealTrpcClient()
  })
}

// Mock data store for development/testing
let mockProjects: any[] = []
let mockProjectCounter = 0

// Create a mock client for Railway deployment
const createMockClient = () => {
  return {
    projects: {
      get: {
        queryOptions: (input: { id: string }) => ({
          queryKey: ["projects", "get", input.id],
          queryFn: async () => {
            const project = mockProjects.find(p => p.id === input.id)
            if (!project) {
              throw new Error("Project not found")
            }
            return project
          }
        }),
        queryKey: (input: { id: string }) => ["projects", "get", input.id]
      },
      list: {
        queryOptions: () => ({
          queryKey: ["projects", "list"],
          queryFn: async () => {
            return mockProjects
          }
        }),
        queryKey: () => ["projects", "list"]
      },
      create: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock create project:", data)
            const newProject = {
              id: `mock-project-${++mockProjectCounter}`,
              name: data.name,
              location: data.location,
              createdAt: new Date().toISOString(),
              questionnaire: null,
              permitRequirements: null
            }
            mockProjects.push(newProject)
            return newProject
          }
        }),
        mutate: async (data: any) => {
          console.log("Mock create project:", data)
          const newProject = {
            id: `mock-project-${++mockProjectCounter}`,
            name: data.name,
            location: data.location,
            createdAt: new Date().toISOString(),
            questionnaire: null,
            permitRequirements: null
          }
          mockProjects.push(newProject)
          return newProject
        }
      },
      delete: {
        useMutation: () => ({
          mutate: async (id: string) => {
            console.log("Mock delete project:", id)
            const index = mockProjects.findIndex(p => p.id === id)
            if (index !== -1) {
              mockProjects.splice(index, 1)
            }
            return { success: true }
          }
        }),
        mutate: async (id: string) => {
          console.log("Mock delete project:", id)
          const index = mockProjects.findIndex(p => p.id === id)
          if (index !== -1) {
            mockProjects.splice(index, 1)
          }
          return { success: true }
        }
      },
      submitQuestionnaire: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock submit questionnaire:", data)
            const project = mockProjects.find(p => p.id === data.projectId)
            if (project) {
              // Update project with questionnaire and permit requirements
              project.questionnaire = data.questionnaire
              project.permitRequirements = {
                type: "NoReview",
                title: "No Permit Required",
                description: "Nothing is required! You're set to build.",
                details: ["Nothing is required! You're set to build."]
              }
              return project
            }
            return { success: true }
          }
        }),
        mutate: async (data: any) => {
          console.log("Mock submit questionnaire:", data)
          const project = mockProjects.find(p => p.id === data.projectId)
          if (project) {
            // Update project with questionnaire and permit requirements
            project.questionnaire = data.questionnaire
            project.permitRequirements = {
              type: "NoReview",
              title: "No Permit Required",
              description: "Nothing is required! You're set to build.",
              details: ["Nothing is required! You're set to build."]
            }
            return project
          }
          return { success: true }
        }
      }
    },
    questionnaire: {
      getQuestionnaireOptions: {
        queryOptions: (input?: any) => ({
          queryKey: ["questionnaire", "options", input],
          queryFn: async () => {
            const { mockQuestionnaireOptions } = await import("../mockData")
            return mockQuestionnaireOptions
          }
        }),
        queryKey: (input?: any) => ["questionnaire", "options", input]
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
        }),
        queryKey: (input: any) => ["questionnaire", "permitRequirements", input]
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
            const project = mockProjects.find(p => p.id === input.id)
            if (!project) {
              throw new Error("Project not found")
            }
            return project
          }
        }),
        queryKey: (input: { id: string }) => ["projects", "get", input.id]
      },
      list: {
        queryOptions: () => ({
          queryKey: ["projects", "list"],
          queryFn: async () => {
            return mockProjects
          }
        }),
        queryKey: () => ["projects", "list"]
      },
      create: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock create project:", data)
            const newProject = {
              id: `mock-project-${++mockProjectCounter}`,
              name: data.name,
              location: data.location,
              createdAt: new Date().toISOString(),
              questionnaire: null,
              permitRequirements: null
            }
            mockProjects.push(newProject)
            return newProject
          }
        }),
        mutate: async (data: any) => {
          console.log("Mock create project:", data)
          const newProject = {
            id: `mock-project-${++mockProjectCounter}`,
            name: data.name,
            location: data.location,
            createdAt: new Date().toISOString(),
            questionnaire: null,
            permitRequirements: null
          }
          mockProjects.push(newProject)
          return newProject
        }
      },
      delete: {
        useMutation: () => ({
          mutate: async (id: string) => {
            console.log("Mock delete project:", id)
            const index = mockProjects.findIndex(p => p.id === id)
            if (index !== -1) {
              mockProjects.splice(index, 1)
            }
            return { success: true }
          }
        }),
        mutate: async (id: string) => {
          console.log("Mock delete project:", id)
          const index = mockProjects.findIndex(p => p.id === id)
          if (index !== -1) {
            mockProjects.splice(index, 1)
          }
          return { success: true }
        }
      },
      submitQuestionnaire: {
        useMutation: () => ({
          mutate: async (data: any) => {
            console.log("Mock submit questionnaire:", data)
            const project = mockProjects.find(p => p.id === data.projectId)
            if (project) {
              // Update project with questionnaire and permit requirements
              project.questionnaire = data.questionnaire
              project.permitRequirements = {
                type: "NoReview",
                title: "No Permit Required",
                description: "Nothing is required! You're set to build.",
                details: ["Nothing is required! You're set to build."]
              }
              return project
            }
            return { success: true }
          }
        }),
        mutate: async (data: any) => {
          console.log("Mock submit questionnaire:", data)
          const project = mockProjects.find(p => p.id === data.projectId)
          if (project) {
            // Update project with questionnaire and permit requirements
            project.questionnaire = data.questionnaire
            project.permitRequirements = {
              type: "NoReview",
              title: "No Permit Required",
              description: "Nothing is required! You're set to build.",
              details: ["Nothing is required! You're set to build."]
            }
            return project
          }
          return { success: true }
        }
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
        queryOptions: (input?: any) => ({
          queryKey: ["questionnaire", "options", input],
          queryFn: async () => {
            const { mockQuestionnaireOptions } = await import("../mockData")
            return mockQuestionnaireOptions
          }
        }),
        queryKey: (input?: any) => ["questionnaire", "options", input]
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
        }),
        queryKey: (input: any) => ["questionnaire", "permitRequirements", input]
      }
    }
  }
}

// Use real tRPC client in development, mock in production
const isDevelopment = import.meta.env.DEV

export const trpcClient = isDevelopment ? createRealTrpcClient() : createMockClient() as any
export const trpc = isDevelopment ? createRealTrpc() : createMockTrpc() as any
