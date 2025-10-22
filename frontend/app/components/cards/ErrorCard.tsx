import { Card, CardContent } from "@/components/ui/card"

export function ErrorCard() {
  return (
    <Card className="shadow-smw-[325px] h-[350px]">
      <CardContent className="flex flex-col items-center justify-center h-full p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
      </CardContent>
    </Card>
  )
}
