import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import React from "react"
import { CARD_HEIGHT, CARD_WIDTH, TOOLTIP_TEXT } from "../../consts/CardConsts"

type QuestionnaireCardWrapperProps = {
  title: string
  children: React.ReactNode
}

export function QuestionnaireCardWrapper({ title, children }: QuestionnaireCardWrapperProps) {
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-4 top-4">
            <Info className="h-6 w-6 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Help</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{TOOLTIP_TEXT}</TooltipContent>
      </Tooltip>
      <Card className={`${CARD_WIDTH} ${CARD_HEIGHT}`}>
        <CardHeader className="pt-6 pb-4 pl-6 pr-12">
          <CardTitle>
            <span className="text-lg text-left">{title}</span>
          </CardTitle>
        </CardHeader>
        <hr />
        {children}
      </Card>
    </div>
  )
}
