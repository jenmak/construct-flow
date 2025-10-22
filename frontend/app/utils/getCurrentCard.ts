import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"

// Returns the current card based on the current step and form data.
export const getCurrentCard = (currentStep: number, formData: QuestionnaireFormDataType) => {
  const workTypes = formData.workTypes

  if (currentStep === 0) {
    return "workTypes"
  }

  try {
    // If no work types are selected yet, return workTypes
    if (!workTypes || workTypes.length === 0) {
      return "workTypes"
    }

    let stepCount = 1

    if (workTypes.includes("Interior")) {
      if (currentStep === stepCount) return "Interior"
      stepCount++
    }

    if (workTypes.includes("Exterior")) {
      if (currentStep === stepCount) return "Exterior"
      stepCount++
    }

    if (workTypes.includes("PropertyAddition")) {
      if (currentStep === stepCount) return "PropertyAddition"
      stepCount++
    }

    return "submit"
  } catch (error) {
    console.warn("Error getting form values in getCurrentCard:", error)
    return "workTypes"
  }
}
