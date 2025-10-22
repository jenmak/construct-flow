// Helper function to check if property addition is valid
export const isPropertyAdditionValid = (
  detail: string | undefined,
  other?: string | undefined
): boolean => {
  if (!detail || detail.trim().length === 0) {
    return false
  }

  // If "Other" is selected, check if other text is provided
  if (detail === "Other" && (!other || other.trim().length === 0)) {
    return false
  }

  return true
}
