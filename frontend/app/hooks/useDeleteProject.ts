import { trpc, trpcClient } from "@/lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/* A hook that contains a mutation for deleting a project. */
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectId: string) => {
      return trpcClient.projects.delete.mutate({ id: projectId })
    },
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: trpc.projects.list.queryKey() })
      console.log("Project deleted successfully")
    },
    onError: (error) => {
      console.error("Failed to delete project:", error)
    }
  })
}
