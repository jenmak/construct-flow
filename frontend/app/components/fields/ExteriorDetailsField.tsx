import { Checkbox } from "@/components/ui/checkbox"
import { FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExteriorDetail } from "../../../src/schemas"
import { useEffect, useState } from "react"
import { EXTERIOR_DETAIL_LABELS } from "../../consts/QuestionnaireLabels"
import { useProjectStore } from "../../stores/projectStore"

export function ExteriorDetailsField() {
  const { questionnaireOptions, initialQuestionnaireData } = useProjectStore()
  const [otherExteriorDetail, setOtherExteriorDetail] = useState<boolean>(
    initialQuestionnaireData?.exteriorDetails?.includes("Other") || false
  )

  useEffect(() => {
    setOtherExteriorDetail(initialQuestionnaireData?.exteriorDetails?.includes("Other") || false)
  }, [initialQuestionnaireData?.exteriorDetails])

  return (
    <>
      <FormField
        name="exteriorDetails"
        render={({ field: { value: exteriorDetails, onChange: setExteriorDetails } }) => (
          <FormItem>
            <FormLabel>Exterior Work Details</FormLabel>
            <FormDescription className="text-left">Select all that apply.</FormDescription>
            <div className="mt-4 space-y-2">
              {questionnaireOptions?.exteriorDetails.map((detail) => (
                <div key={detail} className="flex items-center space-x-2">
                  <Checkbox
                    id={detail}
                    checked={exteriorDetails?.includes(detail as ExteriorDetail) || false}
                    onCheckedChange={(checked) => {
                      const currentValues = exteriorDetails || []
                      if (checked) {
                        setExteriorDetails([...currentValues, detail as ExteriorDetail])
                      } else {
                        setExteriorDetails(
                          currentValues.filter((d: ExteriorDetail) => d !== detail)
                        )
                      }
                      setOtherExteriorDetail(detail === "Other" && checked === true)
                    }}
                  />
                  <Label htmlFor={detail}>{EXTERIOR_DETAIL_LABELS[detail] || detail}</Label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
      {otherExteriorDetail && (
        <FormField
          name="exteriorOther"
          render={({ field: { value: exteriorOther, onChange: setExteriorOther } }) => (
            <FormItem>
              <div className="ml-6 mt-2">
                <Input
                  placeholder="Please specify."
                  value={exteriorOther || ""}
                  onChange={(e) => setExteriorOther(e.target.value)}
                />
              </div>
            </FormItem>
          )}
        />
      )}
    </>
  )
}
