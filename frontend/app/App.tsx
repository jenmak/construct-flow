import { Layout } from "@/Layout"
import { Navigate, Route, Routes } from "react-router"
import { CreateProjectPage } from "./pages/CreateProjectPage"
import { ProjectListPage } from "./pages/ProjectListPage"
import { Project } from "./pages/ProjectPage"

/**
 * This is the main entry point for the frontend application.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/project/:id" element={<Project />} />

        <Route path="/" element={<Navigate to="/projects" />} />
      </Route>
    </Routes>
  )
}
