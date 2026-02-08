"use client"

import { Database, Layers, Award, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "Dataset Size",
    value: "7,500",
    description: "Records",
    icon: Database,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Features",
    value: "13",
    description: "Attributes",
    icon: Layers,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Best Model",
    value: "Logistic Reg.",
    description: "Top Performer",
    icon: Award,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Accuracy",
    value: "80.67%",
    description: "Best Score",
    icon: Target,
    color: "text-success",
    bgColor: "bg-success/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="truncate text-xl font-bold text-card-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
