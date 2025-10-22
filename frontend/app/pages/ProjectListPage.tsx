import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { Link } from "react-router"
import { CreateProjectCard } from "../components/cards/CreateProjectCard"
import { ProjectCard } from "../components/cards/ProjectCard"
import { Heading } from "../components/Heading"
import { ProjectQuestionnaireDrawer } from "../components/ProjectQuestionnaireDrawer"
import { useDeleteProject } from "../hooks/useDeleteProject"
import { useProjectListData } from "../hooks/useProjectListData"

export function ProjectListPage() {
  return (
    <div className="flex flex-col gap-4 mx-4">
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Heading>Projects</Heading>
      <ProjectList />
    </div>
  )
}

function ProjectList() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [drawerId, setDrawerId] = useState<string | null>(null)

  // Fetch project list data from backend
  const {
    data: projectList,
    isLoading: isLoadingProjectList,
    error: projectListError
  } = useProjectListData()

  const deleteProject = useDeleteProject()

  const handleEdit = (id: string) => {
    setDrawerId(id)
    setIsDrawerOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (
      window.confirm("Are you sure you want to delete this project? This action cannot be undone.")
    ) {
      await deleteProject.mutateAsync(projectId!)
    }
  }

  if (isLoadingProjectList) {
    return <div className="text-sm text-muted-foreground">Loading projects...</div>
  }

  if (projectListError) {
    return (
      <div className="text-sm text-red-500">Error loading projects: {projectListError.message}</div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <CreateProjectCard />
        {projectList?.map((project: any) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            id={project.id}
            location={project.location}
            permitRequirements={project.permitRequirements}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <ProjectQuestionnaireDrawer
        id={drawerId!}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
