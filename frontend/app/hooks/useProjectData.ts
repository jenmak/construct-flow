import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useProjectStore } from "../stores/projectStore"
import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"

export function useProjectData(projectId?: string) {
  const query = useQuery({
    ...trpc.projects.get.queryOptions({ id: projectId! }),
    enabled: !!projectId
  })
  const { setInitialQuestionnaireData } = useProjectStore()

  useEffect(() => {
    if (query.data) {
      setInitialQuestionnaireData(query.data.questionnaire as QuestionnaireFormDataType)
    }
  }, [query.data])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}
