import {
  AdditionDetailEnum,
  ExteriorDetailEnum,
  InteriorDetailEnum,
  WorkTypeEnum
} from "#app/schemas/project.ts"
import { procedure, router } from "#core/trpc.ts"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const questionnaire = router({
  getQuestionnaireOptions: procedure.query(() => {
    return {
      workTypes: Object.values(WorkTypeEnum.enum),
      interiorDetails: Object.values(InteriorDetailEnum.enum),
      exteriorDetails: Object.values(ExteriorDetailEnum.enum),
      additionDetail: Object.values(AdditionDetailEnum.enum)
    }
  }),

  getPermitRequirements: procedure
    .input(
      z.object({
        projectId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const project = ctx.cradle.projects.get(input.projectId)

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found."
        })
      }

      if (!project.permitRequirements) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No questionnaire has been submitted for this project."
        })
      }

      return project.permitRequirements
    })
})
