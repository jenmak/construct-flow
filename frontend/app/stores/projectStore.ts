import { PermitRequirementsSchema, QuestionnaireSchema } from "@construct-flow/backend/schemas"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { QuestionnaireFormDataType, QuestionnaireOptions } from "../types/QuestionnaireTypes"

export interface Project {
  id: string
  createdAt: string
  name: string
  location: string
  questionnaire?: QuestionnaireSchema
  permitRequirements?: PermitRequirementsSchema
}

interface ProjectState {
  // Questionnaire options.
  questionnaireOptions: QuestionnaireOptions | null
  isLoadingQuestionnaireOptions: boolean
  questionnaireOptionsError: string | null

  // Actions for questionnaire options.
  setQuestionnaireOptions: (options: QuestionnaireOptions) => void
  setQuestionnaireOptionsLoading: (loading: boolean) => void
  setQuestionnaireOptionsError: (error: string | null) => void

  initialQuestionnaireData: QuestionnaireFormDataType | null
  setInitialQuestionnaireData: (data: QuestionnaireFormDataType) => void
}

const initialState = {
  // Questionnaire options
  questionnaireOptions: null,
  isLoadingQuestionnaireOptions: false,
  questionnaireOptionsError: null,
  // Questionnaire form
  initialQuestionnaireData: null
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      ...initialState,

      setQuestionnaireOptions: (options) => {
        set({ questionnaireOptions: options, questionnaireOptionsError: null })
      },

      setQuestionnaireOptionsLoading: (loading) => {
        set({ isLoadingQuestionnaireOptions: loading })
      },

      setQuestionnaireOptionsError: (error) => {
        set({ questionnaireOptionsError: error })
      },

      setInitialQuestionnaireData: (data: QuestionnaireFormDataType) => {
        set({ initialQuestionnaireData: data })
      },

      reset: () => {
        set(initialState)
      }
    }),
    {
      name: "project-store"
    }
  )
)
