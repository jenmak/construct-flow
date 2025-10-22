import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useProjectStore } from "../stores/projectStore"

/**
 * Hook for fetching questionnaire options from the backend
 * Syncs data to the project store
 */
export function useQuestionnaireOptions() {
  const { setQuestionnaireOptions } = useProjectStore()

  const query = useQuery({
    ...trpc.projects.getQuestionnaireOptions.queryOptions()
  })

  useEffect(() => {
    if (query.data) {
      setQuestionnaireOptions(query.data)
    }
  }, [query.data])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}
