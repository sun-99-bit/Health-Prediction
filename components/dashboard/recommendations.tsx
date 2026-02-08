"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Moon, Salad, Cigarette, Wine, Brain } from "lucide-react"

const tips = [
  {
    icon: Dumbbell,
    title: "Regular Exercise",
    description:
      "Engage in moderate physical activity 3-5 times per week. Even 30 minutes of brisk walking significantly reduces chronic disease risk.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Moon,
    title: "Quality Sleep",
    description:
      "Aim for 7-9 hours of consistent, quality sleep each night. Poor sleep is correlated with increased stress and health risks.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Salad,
    title: "Balanced Diet",
    description:
      "Maintain a diet rich in vegetables, whole grains, and lean proteins. Good diet quality is one of the strongest protective factors.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Cigarette,
    title: "Quit Smoking",
    description:
      "Smoking cessation dramatically reduces risk within the first year. Seek professional support and nicotine replacement therapy.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Wine,
    title: "Moderate Alcohol",
    description:
      "Limit alcohol consumption to low or moderate levels. High alcohol intake is associated with elevated chronic disease rates.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Brain,
    title: "Stress Management",
    description:
      "Practice stress-reduction techniques such as mindfulness, meditation, or regular breaks. Chronic stress compounds health risks.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function Recommendations() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Health Recommendations</CardTitle>
          <CardDescription>
            Evidence-based lifestyle recommendations derived from dataset analysis and medical literature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tips.map((tip) => {
              const Icon = tip.icon
              return (
                <div
                  key={tip.title}
                  className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tip.bgColor}`}
                    >
                      <Icon className={`h-5 w-5 ${tip.color}`} />
                    </div>
                    <h3 className="font-semibold text-card-foreground">{tip.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
