import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Link } from "react-router"
import { CARD_HEIGHT_PROJECT, CARD_WIDTH_PROJECT } from "../../consts/CardConsts"

export function CreateProjectCard() {
  return (
    <Card
      className={`${CARD_WIDTH_PROJECT} ${CARD_HEIGHT_PROJECT} mb-4 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
        <Button
          asChild
          variant="ghost"
          className="flex flex-col items-center gap-2 h-full w-full hover:bg-transparent active:bg-transparent"
        >
          <Link
            to="/projects/new"
            className="flex flex-col items-center gap-2 h-full justify-center"
          >
            <span className="text-lg font-semibold text-muted-foreground">Create Project</span>
            <Plus className="h-6 w-6 text-muted-foreground" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
