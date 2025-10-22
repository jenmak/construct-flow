import { QuestionnaireFormDataType } from "@/app/types/QuestionnaireTypes"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { INTERIOR_WORK_CARD_TITLE } from "../../consts/CardConsts"
import { canAdvance } from "../../utils/canAdvance"
import { InteriorDetailsField } from "../fields/InteriorDetailsField"
import { QuestionnaireCardWrapper } from "./QuestionnaireCardWrapper"

type InteriorWorkCardProps = {
  onNextClick: () => void
  onPreviousClick: () => void
  onSubmit: () => void
  currentStep: number
  isSubmitting?: boolean
  formData: QuestionnaireFormDataType
}

export function InteriorWorkCard({
  onNextClick,
  onPreviousClick,
  onSubmit,
  currentStep,
  isSubmitting = false,
  formData
}: InteriorWorkCardProps) {
  const workTypes = formData.workTypes

  const canAdvanceToNext = canAdvance(currentStep, formData)

  // Determine if this is the final step (Interior work selected last)
  const isFinalStep = workTypes[workTypes.length - 1] === "Interior"

  return (
    <QuestionnaireCardWrapper title={INTERIOR_WORK_CARD_TITLE}>
      <CardContent className="p-6 flex flex-col h-full justify-between">
        <InteriorDetailsField />
      </CardContent>
      <CardFooter className="flex flex-col pt-8 space-y-2">
        <Button onClick={onPreviousClick} variant="outline" className="px-6 w-full">
          Previous
        </Button>
        {isFinalStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canAdvanceToNext || isSubmitting}
            className="px-6 gap-1 w-full"
          >
            <span>Submit</span>
            <Spinner className="w-4 h-4" show={isSubmitting} />
          </Button>
        ) : (
          <Button onClick={onNextClick} disabled={!canAdvanceToNext} className="px-6 w-full">
            Next
          </Button>
        )}
      </CardFooter>
    </QuestionnaireCardWrapper>
  )
}
