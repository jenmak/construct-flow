import { QuestionnaireSchema } from "@construct-flow/shared/schemas"
import z from "zod"

export interface QuestionnaireFormOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export type QuestionnaireFormDataType = z.infer<typeof QuestionnaireSchema>

export type QuestionnaireOptions = {
  workTypes: string[]
  interiorDetails: string[]
  exteriorDetails: string[]
  additionDetail: string[]
}
