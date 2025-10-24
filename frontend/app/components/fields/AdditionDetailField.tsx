import { FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AdditionDetail } from "../../../src/schemas"
import { useEffect, useState } from "react"
import { ADDITION_DETAIL_LABELS } from "../../consts/QuestionnaireLabels"
import { useProjectStore } from "../../stores/projectStore"

export function AdditionDetailField() {
  const { questionnaireOptions, initialQuestionnaireData } = useProjectStore()
  const [otherAdditionDetail, setOtherAdditionDetail] = useState<boolean>(
    initialQuestionnaireData?.additionDetail?.includes("Other") || false
  )

  useEffect(() => {
    setOtherAdditionDetail(initialQuestionnaireData?.additionDetail?.includes("Other") || false)
  }, [initialQuestionnaireData?.additionDetail])

  return (
    <>
      <FormField
        name="additionDetail"
        render={({ field: { value: additionDetail, onChange: setAdditionDetail } }) => (
          <FormItem>
            <FormLabel>Property Addition Detail</FormLabel>
            <FormDescription className="text-left">Select one option.</FormDescription>
            <RadioGroup
              value={additionDetail || ""}
              onValueChange={(value) => {
                setAdditionDetail(value as AdditionDetail)
                setOtherAdditionDetail(value === "Other")
              }}
              className="mt-4"
            >
              {questionnaireOptions?.additionDetail.map((detail) => (
                <div key={detail} className="flex items-center space-x-2">
                  <RadioGroupItem value={detail} id={detail} />
                  <Label htmlFor={detail}>{ADDITION_DETAIL_LABELS[detail] || detail}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormItem>
        )}
      />
      {otherAdditionDetail && (
        <FormField
          name="additionalDetailOther"
          render={({
            field: { value: additionalDetailOther, onChange: setAdditionalDetailOther }
          }) => (
            <FormItem>
              {otherAdditionDetail && (
                <div className="ml-6 mt-2">
                  <Input
                    placeholder="Please specify."
                    value={additionalDetailOther || ""}
                    onChange={(e) => setAdditionalDetailOther(e.target.value)}
                  />
                </div>
              )}
            </FormItem>
          )}
        />
      )}
    </>
  )
}
