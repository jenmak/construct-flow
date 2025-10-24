import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { QuestionnaireSchema } from "../../src/schemas"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { defaultQuestionnaireData } from "../consts/QuestionnaireConsts"
import { useProjectData } from "../hooks/useProjectData"
import { useQuestionnaireOptions } from "../hooks/useQuestionnaireOptions"
import { useQuestionnaireSubmission } from "../hooks/useQuestionnaireSubmission"
import { Project } from "../stores/projectStore"
import { QuestionnaireFormDataType, QuestionnaireFormOptions } from "../types/QuestionnaireTypes"
import { isQuestionnaireOtherFieldIncomplete } from "../utils/isQuestionnaireOtherFieldIncomplete"
import { AdditionDetailField } from "./fields/AdditionDetailField"
import { ExteriorDetailsField } from "./fields/ExteriorDetailsField"
import { InteriorDetailsField } from "./fields/InteriorDetailsField"
import { WorkTypesField } from "./fields/WorkTypeField"

interface ProjectQuestionnaireDrawerProps {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ProjectQuestionnaireDrawer({
  id,
  isOpen,
  onClose
}: ProjectQuestionnaireDrawerProps) {
  const { data: projectData, isLoading: isLoadingProject, error: projectError } = useProjectData(id)
  const [isDirty, setIsDirty] = useState(false)

  const options: QuestionnaireFormOptions = {
    validateOnChange: false,
    validateOnBlur: false
  }
  const { validateOnChange = false, validateOnBlur = false } = options
  const initialQuestionnaireData = projectData?.questionnaire || defaultQuestionnaireData

  const form = useForm<QuestionnaireFormDataType>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: initialQuestionnaireData || defaultQuestionnaireData,
    mode: validateOnChange ? "onChange" : validateOnBlur ? "onBlur" : "onSubmit"
  })

  const formValues = form.watch()

  const {
    data: questionnaireOptions,
    isLoading: isLoadingQuestionnaireOptions,
    error: questionnaireOptionsError
  } = useQuestionnaireOptions()

  const { submitQuestionnaire, isSubmitting: isSubmittingQuestionnaire } =
    useQuestionnaireSubmission({
      onSuccess: (updatedProject: Project) => {
        console.log("Questionnaire submitted successfully, project updated:", updatedProject)
        onClose()
      },
      onError: (error: string) => {
        console.error("Failed to submit questionnaire:", error)
      }
    })

  // Ref to prevent re-initialization
  const isInitializedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!isOpen) {
      isInitializedRef.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && initialQuestionnaireData) {
      form.reset(initialQuestionnaireData)
    }
  }, [isOpen, initialQuestionnaireData, form])

  useEffect(() => {
    setIsDirty(form.formState.isDirty)
  }, [form.formState.isDirty])

  // Handle form submission
  const handleUpdate = async () => {
    try {
      const isValid = form.formState.isValid
      if (!isValid) {
        console.error("Form validation failed:", form.formState.errors)
        return
      }

      // Check if other fields are incomplete
      if (isQuestionnaireOtherFieldIncomplete(formValues)) {
        console.error("Other field is incomplete")
        return
      }

      // Check if form has changed
      if (!isDirty) {
        console.log("Form has not changed, no submission needed.")
        onClose()
        return
      }

      // Submit the questionnaire
      await submitQuestionnaire(id, formValues)
    } catch (error) {
      console.error("Error updating questionnaire:", error)
    }
  }

  // Handle reset - reset form back to original project data
  const handleReset = () => {
    form.reset(initialQuestionnaireData)
    setIsDirty(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">
              {projectData?.name || "Project Questionnaire"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isLoadingProject || isLoadingQuestionnaireOptions ? (
              <div className="flex items-center justify-center h-32">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)}>
                  <div className="space-y-6">
                    {/* Work Types */}
                    <Card>
                      <CardContent>
                        <WorkTypesField />
                      </CardContent>
                    </Card>

                    {/* Interior Details */}
                    {formValues.workTypes?.includes("Interior") && (
                      <Card>
                        <CardContent>
                          {questionnaireOptions && <InteriorDetailsField />}
                        </CardContent>
                      </Card>
                    )}

                    {/* Exterior Details */}
                    {formValues.workTypes?.includes("Exterior") && (
                      <Card>
                        <CardContent>
                          {questionnaireOptions && <ExteriorDetailsField />}
                        </CardContent>
                      </Card>
                    )}

                    {/* Property Addition Details */}
                    {formValues.workTypes?.includes("PropertyAddition") && (
                      <Card>
                        <CardContent>{questionnaireOptions && <AdditionDetailField />}</CardContent>
                      </Card>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex flex-col gap-2">
            {/* Error Display */}
            {(projectError || questionnaireOptionsError) && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">
                {projectError
                  ? "Failed to load project data"
                  : "Failed to load questionnaire options"}
              </div>
            )}

            {/* Action Buttons */}
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSubmittingQuestionnaire || !form.formState.isValid || !isDirty}
              className="w-full"
            >
              {isSubmittingQuestionnaire ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
