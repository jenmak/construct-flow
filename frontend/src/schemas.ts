// Shared schemas - copied from @construct-flow/shared to avoid workspace dependency issues
import { z } from "zod"

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProjectSchema = createProjectSchema.partial()

export type Project = z.infer<typeof projectSchema>
export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
