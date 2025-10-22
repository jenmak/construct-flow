import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { CREATE_PROJECT_SCHEMA, CreateProjectSchema } from "@construct-flow/backend/schemas"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { defaultProjectData } from "../consts/QuestionnaireConsts"
import { useCreateProject } from "../hooks/useCreateProject"

export function CreateProjectPage() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/projects">Projects</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4 w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectForm() {
  const navigate = useNavigate()
  const { createProject, isProjectLoading } = useCreateProject({
    onSuccess: (project) => {
      navigate(`/project/${project.id}`)
    }
  })

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(CREATE_PROJECT_SCHEMA),
    defaultValues: defaultProjectData
  })

  const onSubmit = async (data: CreateProjectSchema) => {
    try {
      await createProject(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("name", e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("location", e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-start" disabled={isProjectLoading}>
          {isProjectLoading ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  )
}
