import { QuestionnaireFormDataType } from "@/app/types/QuestionnaireTypes"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PROPERTY_ADDITION_WORK_CARD_TITLE } from "../../consts/CardConsts"
import { canAdvance } from "../../utils/canAdvance"
import { AdditionDetailField } from "../fields/AdditionDetailField"
import { QuestionnaireCardWrapper } from "./QuestionnaireCardWrapper"

type AdditionWorkCardProps = {
  onPreviousClick: () => void
  onSubmit: () => void
  currentStep: number
  isSubmitting?: boolean
  formData: QuestionnaireFormDataType
}

export function AdditionWorkCard({
  onPreviousClick,
  onSubmit,
  currentStep,
  isSubmitting = false,
  formData
}: AdditionWorkCardProps) {
  const canAdvanceToNext = canAdvance(currentStep, formData)

  return (
    <QuestionnaireCardWrapper title={PROPERTY_ADDITION_WORK_CARD_TITLE}>
      <CardContent className="py-6 px-4 flex flex-col h-full">
        <AdditionDetailField />
        <div className="flex flex-col pt-8 space-y-2"></div>
      </CardContent>
      <CardFooter className="flex flex-col pt-8 space-y-2">
        <Button onClick={onPreviousClick} variant="outline" className="px-6 w-full">
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canAdvanceToNext || isSubmitting}
          className="px-6 gap-2 w-full"
        >
          <span>Submit</span>
          <Spinner className="w-4 h-4" show={isSubmitting} />
        </Button>
      </CardFooter>
    </QuestionnaireCardWrapper>
  )
}
