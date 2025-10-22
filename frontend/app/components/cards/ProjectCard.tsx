import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { CARD_HEIGHT_PROJECT, CARD_WIDTH_PROJECT } from "../../consts/CardConsts"

type PermitRequirements = {
  type: string
  title: string
  description: string
  details: string[]
}

type ProjectCardProps = {
  name: string
  id: string
  location: string
  permitRequirements?: PermitRequirements
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export function ProjectCard({
  name,
  id,
  location,
  permitRequirements,
  onDelete,
  onEdit
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(id)
    } catch (error) {
      console.error("Failed to delete project:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card
        className={`${CARD_WIDTH_PROJECT} ${CARD_HEIGHT_PROJECT} mb-4 flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg relative`}
        key={id}
      >
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 absolute top-2 right-2"
          >
            {!isDeleting && <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete project</span>
            <Spinner color="red" size="sm" show={isDeleting} />
          </Button>
        )}
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center mt-2">
          <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-3">{location}</p>
          {permitRequirements && (
            <div className="w-full">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  permitRequirements.type === "NoReview"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {permitRequirements.title}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
            <Link to={`/project/${id}`}>
              <Eye className="h-4 w-4" />
              <span className="text-sm">View</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onEdit?.(id)}
          >
            <Pencil className="h-4 w-4" />
            <span className="text-sm">Edit</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
