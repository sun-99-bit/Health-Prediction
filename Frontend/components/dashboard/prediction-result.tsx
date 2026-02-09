"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"

export interface PredictionData {
  chronicDisease: boolean
  confidence: number
  riskLevel: "Low" | "Medium" | "High"
}

interface PredictionResultProps {
  prediction: PredictionData | null
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  if (!prediction) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Prediction Result</CardTitle>
          <CardDescription>
            Submit the health input form to see results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No prediction yet. Fill in the form and click &quot;Predict Health Risk&quot;.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const riskConfig = {
    Low: {
      color: "bg-success",
      textColor: "text-success",
      bgLight: "bg-success/10",
      icon: ShieldCheck,
      label: "Low Risk",
    },
    Medium: {
      color: "bg-warning",
      textColor: "text-warning",
      bgLight: "bg-warning/10",
      icon: AlertTriangle,
      label: "Medium Risk",
    },
    High: {
      color: "bg-destructive",
      textColor: "text-destructive",
      bgLight: "bg-destructive/10",
      icon: ShieldAlert,
      label: "High Risk",
    },
  }

  const config = riskConfig[prediction.riskLevel]
  const Icon = config.icon

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">Prediction Result</CardTitle>
        <CardDescription>
          ML model output based on provided health data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Main result */}
        <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-5">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${config.bgLight}`}>
            <Icon className={`h-7 w-7 ${config.textColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Chronic Disease Prediction</p>
            <p className="text-2xl font-bold text-card-foreground">
              {prediction.chronicDisease ? "Yes - At Risk" : "No - Healthy"}
            </p>
          </div>
          <Badge
            className={`${config.bgLight} ${config.textColor} border-transparent text-sm`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">Confidence Score</span>
            <span className={`text-sm font-bold ${config.textColor}`}>
              {prediction.confidence}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${config.color} transition-all duration-700 ease-out`}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        {/* Risk meter */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-card-foreground">Risk Level Meter</span>
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            <div className="flex-1 bg-success" />
            <div className="flex-1 bg-warning" />
            <div className="flex-1 bg-destructive" />
          </div>
          <div className="relative h-4">
            <div
              className="absolute -translate-x-1/2 transition-all duration-700"
              style={{
                left:
                  prediction.riskLevel === "Low"
                    ? "16.5%"
                    : prediction.riskLevel === "Medium"
                      ? "50%"
                      : "83.5%",
              }}
            >
              <div className="flex flex-col items-center">
                <div className={`h-0 w-0 border-x-[6px] border-b-[8px] border-x-transparent ${
                  prediction.riskLevel === "Low"
                    ? "border-b-success"
                    : prediction.riskLevel === "Medium"
                      ? "border-b-warning"
                      : "border-b-destructive"
                }`} style={{ transform: "rotate(180deg)", marginTop: "-2px" }} />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
