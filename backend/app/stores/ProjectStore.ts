import type { PermitRequirementsSchema, QuestionnaireSchema } from "#app/schemas/project.ts"
import { Store, type StoreItem } from "#core/Store.ts"

export interface Project extends StoreItem {
  name: string
  location: string
  questionnaire?: QuestionnaireSchema
  permitRequirements?: PermitRequirementsSchema
}

export class ProjectStore extends Store<Project> {
  constructor() {
    super("projects")
  }

  toModel(item: Project) {
    const model = super.toModel(item)

    return {
      ...model,
      name: item.name,
      location: item.location,
      questionnaire: item.questionnaire,
      permitRequirements: item.permitRequirements
    }
  }
}
