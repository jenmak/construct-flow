import { Project } from "../stores/projectStore"

type ProjectTitleWrapperProps = {
  project?: Project
  children: React.ReactNode
}

export function ProjectTitleWrapper({ project, children }: ProjectTitleWrapperProps) {
  return (
    <>
      <div className="text-center my-6">
        <h1 className="text-2xl font-bold text-gray-900">{project?.name || "Loading..."}</h1>
        <p className="text-muted-foreground mt-2 mb-4">{project?.location}</p>
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </>
  )
}
