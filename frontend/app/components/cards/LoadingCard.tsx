import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { CARD_HEIGHT, CARD_WIDTH } from "../../consts/CardConsts"

type LoadingCardProps = {
  message?: string
}

export function LoadingCard({ message = "Loading" }: LoadingCardProps) {
  return (
    <Card className={`${CARD_WIDTH} ${CARD_HEIGHT}`}>
      <CardContent className="flex flex-col items-center justify-center h-full p-8">
        <Spinner size="xl" variant="primary" className="mb-4" />
        <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">{message}</h3>
      </CardContent>
    </Card>
  )
}
