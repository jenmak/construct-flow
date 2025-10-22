import {
  AdditionDetailEnum,
  CREATE_PROJECT_SCHEMA,
  determinePermitRequirements,
  ExteriorDetailEnum,
  InteriorDetailEnum,
  QuestionnaireSchema,
  UPDATE_PROJECT_SCHEMA,
  WorkTypeEnum
} from "#app/schemas/project.ts"
import { procedure, router } from "#core/trpc.ts"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const projects = router({
  get: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const project = ctx.cradle.projects.get(input.id)

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found."
      })
    }

    return project
  }),

  list: procedure.query(async ({ ctx }) => {
    const records = ctx.cradle.projects.getAll()
    return records.map((record) => ({
      id: record.id,
      createdAt: record.createdAt,
      name: record.name,
      location: record.location,
      permitRequirements: record.permitRequirements
    }))
  }),

  create: procedure.input(CREATE_PROJECT_SCHEMA).mutation(({ ctx, input }) => {
    const project = ctx.cradle.projects.add(input)

    return ctx.cradle.projects.toModel(project)
  }),

  update: procedure.input(UPDATE_PROJECT_SCHEMA).mutation(({ ctx, input }) => {
    const project = ctx.cradle.projects.get(input.projectId)

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found."
      })
    }

    ctx.cradle.projects.update(input.projectId, input)
    const updatedProject = ctx.cradle.projects.get(input.projectId)!
    return ctx.cradle.projects.toModel(updatedProject)
  }),

  submitQuestionnaire: procedure
    .input(
      z.object({
        projectId: z.string(),
        questionnaire: QuestionnaireSchema
      })
    )
    .mutation(({ ctx, input }) => {
      const project = ctx.cradle.projects.get(input.projectId)

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found."
        })
      }

      // Determine permit requirements based on questionnaire and project location
      const permitRequirements = determinePermitRequirements(input.questionnaire, project.location)

      // Update project with questionnaire and permit requirements
      ctx.cradle.projects.update(input.projectId, {
        questionnaire: input.questionnaire,
        permitRequirements
      })

      const updatedProject = ctx.cradle.projects.get(input.projectId)!
      return ctx.cradle.projects.toModel(updatedProject)
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
    }),

  getQuestionnaireOptions: procedure.query(() => {
    return {
      workTypes: Object.values(WorkTypeEnum.enum),
      interiorDetails: Object.values(InteriorDetailEnum.enum),
      exteriorDetails: Object.values(ExteriorDetailEnum.enum),
      additionDetail: Object.values(AdditionDetailEnum.enum)
    }
  }),

  getQuestionnaire: procedure
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

      return {
        questionnaire: project.questionnaire || null,
        permitRequirements: project.permitRequirements || null,
        options: {
          workTypes: Object.values(WorkTypeEnum.enum),
          interiorDetails: Object.values(InteriorDetailEnum.enum),
          exteriorDetails: Object.values(ExteriorDetailEnum.enum),
          additionDetail: Object.values(AdditionDetailEnum.enum)
        }
      }
    }),

  validateQuestionnaire: procedure.input(QuestionnaireSchema).mutation(({ input }) => {
    // This will automatically validate the questionnaire using Zod
    // If validation fails, tRPC will throw an error
    return {
      valid: true,
      message: "Questionnaire is valid",
      data: input
    }
  }),

  delete: procedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    const project = ctx.cradle.projects.get(input.id)

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found."
      })
    }

    ctx.cradle.projects.remove(input.id)
    return { success: true, message: "Project deleted successfully" }
  })
})
