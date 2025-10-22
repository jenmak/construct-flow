import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"

export const formToSubmission = (data: QuestionnaireFormDataType, projectId: string) => {
  return {
    projectId,
    questionnaire: {
      ...data,
      questionnaireId: `questionnaire-${Date.now()}` // Generate unique ID
    }
  }
}
