// Mock data for Railway deployment when backend is not available
import type { Project } from "../app/stores/projectStore"
import type { QuestionnaireFormDataType } from "../app/types/QuestionnaireTypes"

export const mockProject: Project = {
  id: "mock-project-id",
  name: "Mock Project",
  location: "San Francisco, CA",
  questionnaire: {
    questionnaireId: "mock-questionnaire-id",
    workTypes: ["Interior"],
    interiorDetails: ["Flooring"],
    interiorOther: "",
    exteriorDetails: [],
    exteriorOther: "",
    additionDetail: "",
    additionalDetailOther: ""
  },
  permitRequirements: {
    type: "NoReview",
    title: "No Permit Required",
    description: "Nothing is required! You're set to build.",
    details: ["Nothing is required! You're set to build."]
  },
  createdAt: new Date().toISOString()
}

export const mockProjects: Project[] = [mockProject]

export const mockQuestionnaireOptions = {
  workTypes: ["Interior", "Exterior", "PropertyAddition"],
  interiorDetails: ["Flooring", "BathroomRemodel", "NewBathroom", "NewLaundryRoom", "ElectricalWork", "Other"],
  exteriorDetails: ["RoofModsRepair", "GarageDoorReplacement", "DeckConstruction", "GarageModifications", "ExteriorDoors", "Fencing", "Other"],
  additionDetail: ["ADU", "GarageConversion", "BasementAtticConversion", "Other"]
}
