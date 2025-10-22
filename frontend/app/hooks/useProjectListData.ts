import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"

/**
 * Hook for fetching project list data from the backend
 */
export function useProjectListData() {
  const query = useQuery({
    ...trpc.projects.list.queryOptions()
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}
