"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Award } from "lucide-react"

const models = [
  { name: "Logistic Regression", accuracy: 80.67, precision: 0.81, recall: 0.80, f1: 0.80, best: true },
  { name: "Random Forest", accuracy: 80.67, precision: 0.81, recall: 0.81, f1: 0.80, best: false },
  { name: "Gradient Boosting", accuracy: 80.60, precision: 0.80, recall: 0.81, f1: 0.80, best: false },
  { name: "Support Vector Machine", accuracy: 80.67, precision: 0.81, recall: 0.80, f1: 0.80, best: false },
  { name: "KNN", accuracy: 77.87, precision: 0.78, recall: 0.78, f1: 0.77, best: false },
  { name: "Decision Tree", accuracy: 66.47, precision: 0.66, recall: 0.66, f1: 0.66, best: false },
  { name: "Naive Bayes", accuracy: 80.67, precision: 0.81, recall: 0.81, f1: 0.80, best: false },
]

const chartData = models.map((m) => ({
  name: m.name.length > 12 ? `${m.name.slice(0, 12)}...` : m.name,
  fullName: m.name,
  accuracy: m.accuracy,
  best: m.best,
}))

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { fullName: string; accuracy: number }; value: number }>
}

function ModelTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-card-foreground">{data.fullName}</p>
      <p className="text-muted-foreground">
        Accuracy: <span className="font-medium text-primary">{data.accuracy}%</span>
      </p>
    </div>
  )
}

export function ModelPerformance() {
  return (
    <div className="flex flex-col gap-6">
      {/* Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Model Accuracy Comparison</CardTitle>
          <CardDescription>
            Visual comparison of all trained classifiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 30, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  className="fill-muted-foreground"
                />
                <YAxis
                  domain={[60, 85]}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ModelTooltip />} />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.best ? "hsl(174, 62%, 38%)" : "hsl(199, 89%, 48%)"}
                      fillOpacity={entry.best ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Detailed Model Metrics</CardTitle>
          <CardDescription>
            Precision, recall, F1-score, and accuracy for each model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Precision</TableHead>
                <TableHead className="hidden text-right md:table-cell">Recall</TableHead>
                <TableHead className="hidden text-right lg:table-cell">F1-Score</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow
                  key={model.name}
                  className={model.best ? "bg-primary/5" : ""}
                >
                  <TableCell className="font-medium text-card-foreground">
                    <div className="flex items-center gap-2">
                      {model.best && <Award className="h-4 w-4 text-warning" />}
                      {model.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-card-foreground">
                    {model.accuracy}%
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-muted-foreground sm:table-cell">
                    {model.precision.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-muted-foreground md:table-cell">
                    {model.recall.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-muted-foreground lg:table-cell">
                    {model.f1.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {model.best ? (
                      <Badge className="bg-primary/15 text-primary border-transparent hover:bg-primary/20">
                        Best Model
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">
                        Trained
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
