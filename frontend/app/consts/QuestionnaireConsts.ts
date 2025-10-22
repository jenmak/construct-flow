import { CreateProjectSchema } from "@permitflow/backend/schemas"
import { QuestionnaireFormDataType } from "../types/QuestionnaireTypes"

// Default questionnaire form data.
export const defaultQuestionnaireData: QuestionnaireFormDataType = {
  questionnaireId: "",
  workTypes: [],
  interiorDetails: [],
  interiorOther: "",
  exteriorDetails: [],
  exteriorOther: "",
  additionDetail: "",
  additionalDetailOther: ""
}

// Default form data for creating a new project.
export const defaultProjectData: CreateProjectSchema = {
  name: "",
  location: "San Francisco, CA"
}
