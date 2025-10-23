import { Checkbox } from "@/components/ui/checkbox"
import { FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { WorkType } from "@construct-flow/shared/schemas"
import { WORK_TYPE_LABELS } from "../../consts/QuestionnaireLabels"
import { useProjectStore } from "../../stores/projectStore"

export function WorkTypesField() {
  const { questionnaireOptions } = useProjectStore()

  return (
    <FormField
      name="workTypes"
      render={({ field: { value: workTypes, onChange: setWorkTypes } }) => (
        <FormItem>
          <FormLabel>Work Types</FormLabel>
          <FormDescription className="text-left">Select all that apply.</FormDescription>
          <div className="mt-4 space-y-2">
            {questionnaireOptions?.workTypes.map((workType) => (
              <div key={workType} className="flex items-center space-x-2">
                <Checkbox
                  id={workType}
                  checked={workTypes.includes(workType as WorkType) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setWorkTypes([...workTypes, workType as WorkType])
                    } else {
                      setWorkTypes(workTypes.filter((wt: WorkType) => wt !== workType))
                    }
                  }}
                />
                <Label htmlFor={workType}>{WORK_TYPE_LABELS[workType]}</Label>
              </div>
            ))}
          </div>
        </FormItem>
      )}
    />
  )
}
