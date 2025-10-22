import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"

export const isQuestionnaireOtherFieldIncomplete = (
  questionnaireFormData: QuestionnaireFormDataType
) => {
  // Check interior details
  if (
    questionnaireFormData.interiorDetails?.includes("Other") &&
    (!questionnaireFormData.interiorOther || questionnaireFormData.interiorOther.trim() === "")
  ) {
    return true
  }

  // Check exterior details
  if (
    questionnaireFormData.exteriorDetails?.includes("Other") &&
    (!questionnaireFormData.exteriorOther || questionnaireFormData.exteriorOther.trim() === "")
  ) {
    return true
  }

  // Check addition details
  if (
    questionnaireFormData.additionDetail === "Other" &&
    (!questionnaireFormData.additionalDetailOther ||
      questionnaireFormData.additionalDetailOther.trim() === "")
  ) {
    return true
  }

  return false
}
