import { trpc, trpcClient } from "@/lib/trpc"
import { QuestionnaireSchema } from "@construct-flow/shared/schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Project } from "../stores/projectStore"
import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"
import { isQuestionnaireOtherFieldIncomplete } from "../utils/isQuestionnaireOtherFieldIncomplete"

interface UseQuestionnaireSubmissionOptions {
  onSuccess?: (project: any) => void
  onError?: (error: any) => void
}

/**
 * Hook for managing questionnaire submission
 */
export function useQuestionnaireSubmission(options?: UseQuestionnaireSubmissionOptions) {
  const { onSuccess, onError } = options || {}
  const queryClient = useQueryClient()

  const submitQuestionnaireMutation = useMutation({
    mutationFn: async ({
      projectId,
      questionnaire
    }: {
      projectId: string
      questionnaire: QuestionnaireFormDataType
    }) => {
      return trpcClient.projects.submitQuestionnaire.mutate({
        projectId,
        questionnaire: questionnaire as QuestionnaireSchema
      })
    },
    onSuccess: (updatedProject: Project) => {
      console.log("Questionnaire submitted successfully:", updatedProject)
      // Invalidate and refetch project data
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ id: updatedProject.id })
      })
      queryClient.invalidateQueries({ queryKey: trpc.projects.list.queryKey() })

      onSuccess?.(updatedProject)
    },
    onError: (error) => {
      console.error("Failed to submit questionnaire:", error)
      onError?.(error)
    }
  })

  const submitQuestionnaire = async (
    projectId: string,
    questionnaire: QuestionnaireFormDataType
  ) => {
    // Validate questionnaire is complete before saving
    if (!questionnaire.workTypes || questionnaire.workTypes.length === 0) {
      throw new Error("Please select at least one work type")
    }

    // Check if "Other" fields are incomplete
    if (isQuestionnaireOtherFieldIncomplete(questionnaire)) {
      throw new Error("Please complete all 'Other' field descriptions")
    }

    try {
      const result = await submitQuestionnaireMutation.mutateAsync({ projectId, questionnaire })
      return result
    } finally {
      return submitQuestionnaireMutation.error
    }
  }

  return {
    submitQuestionnaire,
    isSubmitting: submitQuestionnaireMutation.isPending,
    error: submitQuestionnaireMutation.error,
    isSuccess: submitQuestionnaireMutation.isSuccess,
    reset: submitQuestionnaireMutation.reset
  }
}
