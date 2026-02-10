"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  Legend,
} from "recharts"

// Age group vs Chronic Disease %
const ageGroupData = [
  { group: "18-25", diseaseRate: 28, count: 950 },
  { group: "26-35", diseaseRate: 31, count: 1250 },
  { group: "36-45", diseaseRate: 34, count: 1400 },
  { group: "46-55", diseaseRate: 37, count: 1300 },
  { group: "56-65", diseaseRate: 40, count: 1100 },
  { group: "66-75", diseaseRate: 43, count: 900 },
  { group: "76-80", diseaseRate: 46, count: 600 },
]

// BMI distribution
const bmiDistribution = [
  { range: "<18.5", count: 420, label: "Underweight" },
  { range: "18.5-24.9", count: 2250, label: "Normal" },
  { range: "25-29.9", count: 2700, label: "Overweight" },
  { range: "30-34.9", count: 1350, label: "Obese I" },
  { range: "35-39.9", count: 540, label: "Obese II" },
  { range: "40+", count: 240, label: "Obese III" },
]

const bmiColors = [
  "hsl(199, 89%, 48%)",
  "hsl(174, 62%, 38%)",
  "hsl(43, 74%, 49%)",
  "hsl(27, 87%, 67%)",
  "hsl(12, 76%, 61%)",
  "hsl(0, 84%, 60%)",
]

// Sleep vs Stress scatter data
const sleepStressData = Array.from({ length: 80 }, () => ({
  sleep: Number.parseFloat((3 + Math.random() * 7).toFixed(1)),
  stress: Math.floor(1 + Math.random() * 10),
  disease: Math.random() > 0.65 ? "Yes" : "No",
}))

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function AgeTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">Age: {label}</p>
      <p className="text-muted-foreground">
        Disease Rate: <span className="font-medium text-primary">{payload[0].value}%</span>
      </p>
    </div>
  )
}

function BmiTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{data.label}</p>
      <p className="text-muted-foreground">BMI Range: {data.range}</p>
      <p className="text-muted-foreground">
        Count: <span className="font-medium text-primary">{data.count}</span>
      </p>
    </div>
  )
}

function ScatterTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  const isDisease = data.disease === "Yes"

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground">
        Sleep: <span className="font-medium">{data.sleep}h</span>
      </p>
      <p className="text-muted-foreground">
        Stress: <span className="font-medium">{data.stress}/10</span>
      </p>
      <p className="text-muted-foreground">
        Disease:{" "}
        <span className={`font-semibold ${isDisease ? "text-destructive" : "text-green-600"}`}>
          {data.disease}
        </span>
      </p>
    </div>
  )
}

export function AnalyticsCharts() {
  const diseaseYes = sleepStressData.filter((d) => d.disease === "Yes")
  const diseaseNo = sleepStressData.filter((d) => d.disease === "No")

  return (
    <div className="flex flex-col gap-6">
      {/* Age + BMI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Age Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Age Group vs Chronic Disease</CardTitle>
            <CardDescription>Percentage of disease by age group</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<AgeTooltip />} />
                <Bar dataKey="diseaseRate" fill="hsl(174, 62%, 38%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BMI Chart */}
        <Card>
          <CardHeader>
            <CardTitle>BMI Distribution</CardTitle>
            <CardDescription>WHO BMI categories</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip content={<BmiTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {bmiDistribution.map((_, i) => (
                    <Cell key={i} fill={bmiColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scatter */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep vs Stress</CardTitle>
          <CardDescription>Disease correlation</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="sleep" unit="h" domain={[3, 10]} />
              <YAxis type="number" dataKey="stress" domain={[1, 10]} />
              <Tooltip content={<ScatterTooltip />} />
              <Legend />
              <Scatter name="No Disease" data={diseaseNo} fill="hsl(174, 62%, 38%)" />
              <Scatter name="Has Disease" data={diseaseYes} fill="hsl(0, 84%, 60%)" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
