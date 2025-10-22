// Helper function to check if a specific work type section is valid.
export const isWorkTypeSectionValid = (
  details: string[] | undefined,
  other?: string | undefined
): boolean => {
  if (!details || details.length === 0) {
    return false
  }

  // If "Other" is selected, check if other text is provided
  if (details.includes("Other") && (!other || other.trim().length === 0)) {
    return false
  }

  return true
}
