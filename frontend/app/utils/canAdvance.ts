import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"
import { getCurrentCard } from "./getCurrentCard"
import { isPropertyAdditionValid } from "./isPropertyAdditionValid"
import { isWorkTypeSectionValid } from "./isWorkTypeSectionValid"

// Returns true if the user can advance to the next step.
export const canAdvance = (currentStep: number, formData: QuestionnaireFormDataType) => {
  try {
    const currentCard = getCurrentCard(currentStep, formData)

    // For workTypes step, just check if at least one work type is selected
    if (currentCard === "workTypes") {
      const selectedWorkTypes = formData.workTypes || []
      const canAdvance = selectedWorkTypes.length > 0
      return canAdvance
    }

    // For detail steps, check if the current work type has valid details
    if (currentCard === "Interior") {
      return isWorkTypeSectionValid(formData.interiorDetails, formData.interiorOther)
    }

    if (currentCard === "Exterior") {
      return isWorkTypeSectionValid(formData.exteriorDetails, formData.exteriorOther)
    }

    if (currentCard === "PropertyAddition") {
      return isPropertyAdditionValid(formData.additionDetail, formData.additionalDetailOther)
    }

    return false
  } catch (error) {
    console.warn("Error checking canAdvance:", error)
    return false
  }
}
