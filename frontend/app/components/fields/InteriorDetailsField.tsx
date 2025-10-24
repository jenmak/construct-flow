import { Checkbox } from "@/components/ui/checkbox"
import { FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InteriorDetail } from "../../../src/schemas"
import { useEffect, useState } from "react"
import { INTERIOR_DETAIL_LABELS } from "../../consts/QuestionnaireLabels"
import { useProjectStore } from "../../stores/projectStore"

export function InteriorDetailsField() {
  const { questionnaireOptions, initialQuestionnaireData } = useProjectStore()
  const [otherInteriorDetail, setOtherInteriorDetail] = useState<boolean>(
    initialQuestionnaireData?.interiorDetails?.includes("Other") || false
  )

  useEffect(() => {
    setOtherInteriorDetail(initialQuestionnaireData?.interiorDetails?.includes("Other") || false)
  }, [initialQuestionnaireData?.interiorDetails])

  return (
    <>
      <FormField
        name="interiorDetails"
        render={({ field: { value: interiorDetails, onChange: setInteriorDetails } }) => (
          <FormItem>
            <FormLabel>Interior Work Details</FormLabel>
            <FormDescription className="text-left">Select all that apply.</FormDescription>
            <div className="mt-4 space-y-2">
              {questionnaireOptions?.interiorDetails.map((detail) => (
                <div key={detail} className="flex items-center space-x-2">
                  <Checkbox
                    id={detail}
                    checked={interiorDetails?.includes(detail as InteriorDetail) || false}
                    onCheckedChange={(checked) => {
                      const currentValues = interiorDetails || []
                      if (checked) {
                        setInteriorDetails([...currentValues, detail as InteriorDetail])
                      } else {
                        setInteriorDetails(
                          currentValues.filter((d: InteriorDetail) => d !== detail)
                        )
                      }
                      setOtherInteriorDetail(detail === "Other" && checked === true)
                    }}
                  />
                  <Label htmlFor={detail}>{INTERIOR_DETAIL_LABELS[detail] || detail}</Label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
      {otherInteriorDetail && (
        <FormField
          name="interiorOther"
          render={({ field: { value: interiorOther, onChange: setInteriorOther } }) => (
            <FormItem>
              <div className="ml-6 mt-2">
                <Input
                  placeholder="Please specify."
                  value={interiorOther || ""}
                  onChange={(e) => setInteriorOther(e.target.value)}
                />
              </div>
            </FormItem>
          )}
        />
      )}
    </>
  )
}
