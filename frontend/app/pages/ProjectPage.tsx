import { TooltipProvider } from "@/components/ui/tooltip"
import { zodResolver } from "@hookform/resolvers/zod"
import { QuestionnaireSchema } from "@permitflow/backend/schemas"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router"
import { AdditionWorkCard } from "../components/cards/AdditionWorkCard"
import { ExteriorWorkCard } from "../components/cards/ExteriorWorkCard"
import { InteriorWorkCard } from "../components/cards/InteriorWorkCard"
import { LoadingCard } from "../components/cards/LoadingCard"
import { PermitRequirementsCard } from "../components/cards/PermitRequirementsCard"
import { WorkTypeCard } from "../components/cards/WorkTypeCard"
import { ProjectTitleWrapper } from "../components/ProjectTitleWrapper"
import { LOADING_CARD_MESSAGE } from "../consts/CardConsts"
import { defaultQuestionnaireData } from "../consts/QuestionnaireConsts"
import { useProjectData } from "../hooks/useProjectData"
import { useQuestionnaireOptions } from "../hooks/useQuestionnaireOptions"
import { useQuestionnaireSubmission } from "../hooks/useQuestionnaireSubmission"
import { QuestionnaireFormDataType, QuestionnaireFormOptions } from "../types/QuestionnaireTypes"
import { getCurrentCard } from "../utils/getCurrentCard"

export function Project() {
  const { id } = useParams()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [currentCard, setCurrentCard] = useState<string>("workTypes")

  const { data: project, isLoading: isLoadingProject, error: projectError } = useProjectData(id)

  const options: QuestionnaireFormOptions = {
    validateOnChange: false,
    validateOnBlur: false
  }
  const { validateOnChange = false, validateOnBlur = false } = options
  const initialQuestionnaireData = project?.questionnaire || defaultQuestionnaireData

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

  // Use the questionnaire submission hook to submit the questionnaire to the backend.
  const { submitQuestionnaire, isSubmitting: isSubmittingQuestionnaire } =
    useQuestionnaireSubmission({
      onSuccess: (updatedProject) => {
        console.log("Questionnaire submitted successfully, project updated:", updatedProject)
      },
      onError: (error) => {
        console.error("Failed to submit questionnaire:", error)
      }
    })

  // Check if project has permit requirements and has completed the questionnaire.
  const hasPermitRequirements = project?.permitRequirements

  useEffect(() => {
    setCurrentCard(getCurrentCard(currentStep, formValues))
  }, [currentStep])

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleSubmit = async () => {
    setCurrentCard("submit")
    try {
      if (!id) {
        console.error("No project ID available")
        return
      }
      await submitQuestionnaire(id, formValues)
    } catch (error) {
      console.error("Error submitting questionnaire:", error)
    }
  }

  // Ensure form is properly initialized before rendering
  if (!form || typeof form.getValues !== "function") {
    console.warn("Form is not properly initialized, showing loader")
    return (
      <ProjectTitleWrapper>
        <LoadingCard message="Initializing form." />
      </ProjectTitleWrapper>
    )
  }

  // If project has permit requirements, show results.
  if (hasPermitRequirements) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-8">
        <ProjectTitleWrapper project={project}>
          <PermitRequirementsCard />
        </ProjectTitleWrapper>
      </div>
    )
  }

  if (!questionnaireOptions) {
    return (
      <ProjectTitleWrapper project={project}>
        <LoadingCard message="Loading questionnaire options." />
      </ProjectTitleWrapper>
    )
  }

  // Otherwise, show questionnaire flow.
  return (
    <FormProvider {...form}>
      <TooltipProvider>
        <ProjectTitleWrapper project={project}>
          {(isLoadingProject || isLoadingQuestionnaireOptions) && (
            <LoadingCard message="Loading project data." />
          )}
          {projectError && (
            <div className="text-red-500">Error loading project: {projectError.message}</div>
          )}
          {questionnaireOptionsError && (
            <div className="text-red-500">
              Error loading questionnaire options: {questionnaireOptionsError.message}
            </div>
          )}
          {currentCard === "workTypes" && (
            <WorkTypeCard
              key={`worktypes-${currentStep}`}
              onNextClick={handleNext}
              currentStep={currentStep}
              formData={formValues}
            />
          )}
          {currentCard === "Interior" && (
            <InteriorWorkCard
              key={`interior-${currentStep}`}
              onNextClick={handleNext}
              onPreviousClick={handlePrevious}
              onSubmit={handleSubmit}
              currentStep={currentStep}
              isSubmitting={isSubmittingQuestionnaire}
              formData={formValues}
            />
          )}
          {currentCard === "Exterior" && (
            <ExteriorWorkCard
              key={`exterior-${currentStep}`}
              onNextClick={handleNext}
              onPreviousClick={handlePrevious}
              onSubmit={handleSubmit}
              currentStep={currentStep}
              isSubmitting={isSubmittingQuestionnaire}
              formData={formValues}
            />
          )}
          {currentCard === "PropertyAddition" && (
            <AdditionWorkCard
              key={`property-addition-${currentStep}`}
              onPreviousClick={handlePrevious}
              onSubmit={handleSubmit}
              currentStep={currentStep}
              isSubmitting={isSubmittingQuestionnaire}
              formData={formValues}
            />
          )}
          {currentCard === "submit" && isSubmittingQuestionnaire && (
            <LoadingCard message={LOADING_CARD_MESSAGE} />
          )}
        </ProjectTitleWrapper>
      </TooltipProvider>
    </FormProvider>
  )
}
