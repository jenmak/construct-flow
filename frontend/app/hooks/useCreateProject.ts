import { trpc, trpcClient } from "@/lib/trpc"
import { CreateProjectSchema } from "@construct-flow/shared/schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseCreateProjectOptions {
  onSuccess?: (project: any) => void
  onError?: (error: any) => void
}

/**
 * Hook for managing project creation
 * Integrates with the projectStore for form state management
 */
export function useCreateProject(options?: UseCreateProjectOptions) {
  const { onSuccess, onError } = options || {}
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectSchema) => {
      return trpcClient.projects.create.mutate(data)
    },
    onSuccess: (project) => {
      console.log("Project created successfully:", project)
      // Invalidate and refetch project list
      queryClient.invalidateQueries({ queryKey: trpc.projects.list.queryKey() })

      onSuccess?.(project)
    },
    onError: (error) => {
      console.error("Failed to create project:", error)
      onError?.(error)
    }
  })

  const createProject = async (data: CreateProjectSchema) => {
    try {
      const result = await createProjectMutation.mutateAsync(data)
      return result
    } finally {
      return createProjectMutation.error
    }
  }

  return {
    createProject,
    isProjectLoading: createProjectMutation.isPending,
    error: createProjectMutation.error,
    isSuccess: createProjectMutation.isSuccess,
    reset: createProjectMutation.reset
  }
}
