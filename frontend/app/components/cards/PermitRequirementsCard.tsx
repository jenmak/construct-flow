import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"
import { CARD_HEIGHT, CARD_WIDTH } from "../../consts/CardConsts"
import { LoadingCard } from "./LoadingCard"

export function PermitRequirementsCard() {
  const { id } = useParams()

  const { data: permitRequirements, isLoading } = useQuery(
    trpc.projects.getPermitRequirements.queryOptions({ projectId: id! })
  )

  const { description, details, title, type } = permitRequirements || {}

  if (isLoading) {
    return <LoadingCard message="Loading permit requirements..." />
  }

  return (
    <Card className={`${CARD_WIDTH} ${CARD_HEIGHT} p-4 text-left`}>
      <Alert className="mb-4" variant={type === "NoReview" ? "default" : "destructive"}>
        <AlertTitle className="text-center">{title}</AlertTitle>
        <AlertDescription className="text-center">{description}</AlertDescription>
      </Alert>
      <CardContent className="flex flex-col h-full">
        <CardTitle className="text-center font-semibold mb-3 text-muted-foreground">
          More Details
        </CardTitle>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">{description}</h3>
          <ul className="list-disc list-outside space-y-1 ml-4">
            {details?.map((detail) => (
              <li key={detail} className="text-sm text-muted-foreground pl-2">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link className="w-full" to="/projects">
          <Button className="w-full">Back to Projects</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
