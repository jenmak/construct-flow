import { z } from "zod"

// Enums
export const WorkTypeEnum = z.enum(["Interior", "Exterior", "PropertyAddition"])
export const InteriorDetailEnum = z.enum([
  "Flooring",
  "BathroomRemodel",
  "NewBathroom",
  "NewLaundryRoom",
  "ElectricalWork",
  "Other"
])
export const ExteriorDetailEnum = z.enum([
  "RoofModsRepair",
  "GarageDoorReplacement",
  "DeckConstruction",
  "GarageModifications",
  "ExteriorDoors",
  "Fencing",
  "Other"
])
export const AdditionDetailEnum = z.enum([
  "ADU",
  "GarageConversion",
  "BasementAtticConversion",
  "Other"
])
export const PermitRequirementEnum = z.enum(["FullReview", "OTCReview", "NoReview"])

// Questionnaire Schema
export const QuestionnaireSchema = z
  .object({
    questionnaireId: z.string(),
    workTypes: z.array(WorkTypeEnum).min(1, "At least one work type must be selected"),
    interiorDetails: z.array(InteriorDetailEnum).optional(),
    interiorOther: z.string().optional(),
    exteriorDetails: z.array(ExteriorDetailEnum).optional(),
    exteriorOther: z.string().optional(),
    additionDetail: z.string(AdditionDetailEnum).optional(),
    additionalDetailOther: z.string().optional()
  })
  .refine(
    (data) => {
      // If Interior is selected, interiorDetails must have at least 1 value
      if (data.workTypes.includes("Interior")) {
        return data.interiorDetails && data.interiorDetails.length > 0
      }
      return true
    },
    {
      message: "If Interior work is selected, at least one interior detail must be specified",
      path: ["interiorDetails"]
    }
  )
  .refine(
    (data) => {
      // If Exterior is selected, exteriorDetails must have at least 1 value
      if (data.workTypes.includes("Exterior")) {
        return data.exteriorDetails && data.exteriorDetails.length > 0
      }
      return true
    },
    {
      message: "If Exterior work is selected, at least one exterior detail must be specified",
      path: ["exteriorDetails"]
    }
  )
  .refine(
    (data) => {
      // If PropertyAddition is selected, additionDetail must have exactly 1 value
      if (data.workTypes.includes("PropertyAddition")) {
        return data.additionDetail && data.additionDetail.length > 0
      }
      return true
    },
    {
      message: "If Property Addition is selected, exactly one addition detail must be specified",
      path: ["additionDetail"]
    }
  )
  .refine(
    (data) => {
      // If interiorDetails contains "Other", interiorOther is required
      if (data.interiorDetails?.includes("Other")) {
        return data.interiorOther && data.interiorOther.trim().length > 0
      }
      return true
    },
    {
      message: "If 'Other' is selected for interior details, please specify what other work",
      path: ["interiorOther"]
    }
  )
  .refine(
    (data) => {
      // If exteriorDetails contains "Other", exteriorOther is required
      if (data.exteriorDetails?.includes("Other")) {
        return data.exteriorOther && data.exteriorOther.trim().length > 0
      }
      return true
    },
    {
      message: "If 'Other' is selected for exterior details, please specify what other work",
      path: ["exteriorOther"]
    }
  )
  .refine(
    (data) => {
      // If additionDetail contains "Other", additionalDetailOther is required
      if (data.additionDetail?.includes("Other")) {
        return data.additionalDetailOther && data.additionalDetailOther.trim().length > 0
      }
      return true
    },
    {
      message:
        "If 'Other' is selected for property addition details, please specify what other work",
      path: ["additionalDetailOther"]
    }
  )

// Permit Requirements Schema
export const PermitRequirementsSchema = z.object({
  type: PermitRequirementEnum,
  title: z.string(),
  description: z.string(),
  details: z.array(z.string())
})

// Project Schemas
export const CREATE_PROJECT_SCHEMA = z.object({
  name: z.string().min(1),
  location: z.string().min(1)
})

export const UPDATE_PROJECT_SCHEMA = z.object({
  projectId: z.string(),
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  questionnaire: QuestionnaireSchema.optional(),
  permitRequirements: PermitRequirementsSchema.optional()
})

// Type exports
export type CreateProjectSchema = z.infer<typeof CREATE_PROJECT_SCHEMA>
export type UpdateProjectSchema = z.infer<typeof UPDATE_PROJECT_SCHEMA>
export type QuestionnaireSchema = z.infer<typeof QuestionnaireSchema>
export type PermitRequirementsSchema = z.infer<typeof PermitRequirementsSchema>
export type WorkType = z.infer<typeof WorkTypeEnum>
export type InteriorDetail = z.infer<typeof InteriorDetailEnum>
export type ExteriorDetail = z.infer<typeof ExteriorDetailEnum>
export type AdditionDetail = z.infer<typeof AdditionDetailEnum>
export type PermitRequirement = z.infer<typeof PermitRequirementEnum>

// Utility function to determine permit requirements
export function determinePermitRequirements(
  questionnaire: QuestionnaireSchema,
  location: string
): PermitRequirementsSchema {
  // Priority order: FullReview > OTCReview > NoReview

  // Check for Full Review conditions
  if (
    // Any property addition work
    !!questionnaire.additionDetail?.length ||
    // New bathroom or new laundry room
    questionnaire.interiorDetails?.includes("NewBathroom") ||
    questionnaire.interiorDetails?.includes("NewLaundryRoom") ||
    // Any "Other" option selected
    questionnaire.interiorDetails?.includes("Other") ||
    questionnaire.exteriorDetails?.includes("Other") ||
    questionnaire.additionDetail?.includes("Other") ||
    // San Francisco + structural work
    (location === "San Francisco, CA" &&
      (questionnaire.exteriorDetails?.includes("DeckConstruction") ||
        questionnaire.exteriorDetails?.includes("GarageModifications")))
  ) {
    return {
      type: "FullReview",
      title: "In-House Review Process",
      description: "A building permit is required with plan sets and in-house review.",
      details: [
        "A building permit is required.",
        "Include plan sets.",
        "Submit application for in-house review."
      ]
    }
  }

  // Check for OTC Review conditions
  if (
    // Bathroom remodel
    questionnaire.interiorDetails?.includes("BathroomRemodel") ||
    // Electrical work
    questionnaire.interiorDetails?.includes("ElectricalWork") ||
    // Roof modifications/repair
    questionnaire.exteriorDetails?.includes("RoofModsRepair") ||
    // Both garage door replacement AND exterior doors
    (questionnaire.exteriorDetails?.includes("GarageDoorReplacement") &&
      questionnaire.exteriorDetails?.includes("ExteriorDoors"))
  ) {
    return {
      type: "OTCReview",
      title: "Over-the-Counter Submission Process",
      description: "A building permit is required with OTC review.",
      details: ["A building permit is required.", "Submit application for OTC review."]
    }
  }

  // Default to No Review
  return {
    type: "NoReview",
    title: "No Permit Required",
    description: "Nothing is required! You're set to build.",
    details: ["Nothing is required! You're set to build."]
  }
}
