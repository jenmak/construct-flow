import { QuestionnaireFormDataType } from "@/app/types/QuestionnaireTypes"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { WORK_TYPE_CARD_TITLE } from "../../consts/CardConsts"
import { canAdvance } from "../../utils/canAdvance"
import { WorkTypesField } from "../fields/WorkTypeField"
import { QuestionnaireCardWrapper } from "./QuestionnaireCardWrapper"

type WorkTypeCardProps = {
  onNextClick: () => void
  currentStep: number
  formData: QuestionnaireFormDataType
}

export function WorkTypeCard({ onNextClick, currentStep, formData }: WorkTypeCardProps) {
  const canAdvanceToNext = canAdvance(currentStep, formData)

  return (
    <QuestionnaireCardWrapper title={WORK_TYPE_CARD_TITLE}>
      <CardContent className="p-6 flex flex-col h-full justify-between">
        <WorkTypesField />
      </CardContent>
      <CardFooter>
        <Button onClick={onNextClick} disabled={!canAdvanceToNext} className="px-6 w-full">
          Next
        </Button>
      </CardFooter>
    </QuestionnaireCardWrapper>
  )
}
