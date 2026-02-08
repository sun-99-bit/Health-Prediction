"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const features = [
  { name: "Age", type: "Numeric", range: "18 - 80", description: "Age in years" },
  { name: "Gender", type: "Categorical", range: "Male / Female / Other", description: "Biological gender" },
  { name: "Height_cm", type: "Numeric", range: "140 - 200", description: "Height in centimeters" },
  { name: "Weight_kg", type: "Numeric", range: "35 - 120", description: "Weight in kilograms" },
  { name: "BMI", type: "Numeric", range: "11.8 - 50+", description: "Body Mass Index" },
  { name: "Smoker", type: "Binary", range: "Yes / No", description: "Smoking status" },
  { name: "Exercise_Freq", type: "Categorical", range: "None - Daily", description: "Weekly exercise frequency" },
  { name: "Diet_Quality", type: "Categorical", range: "Poor - Excellent", description: "Overall diet quality" },
  { name: "Alcohol_Consumption", type: "Categorical", range: "None - High", description: "Alcohol intake level" },
  { name: "Chronic_Disease", type: "Binary", range: "Yes / No", description: "Target variable" },
  { name: "Stress_Level", type: "Numeric", range: "1 - 10", description: "Self-reported stress" },
  { name: "Sleep_Hours", type: "Numeric", range: "3 - 10", description: "Average hours of sleep" },
]

const sampleData = [
  { id: 1, age: 56, gender: "Other", height: 177.6, weight: 37.3, bmi: 11.8, smoker: "Yes", exercise: "None", diet: "Poor", alcohol: "None", disease: "No", stress: 9, sleep: 8.5 },
  { id: 2, age: 69, gender: "Other", height: 169.3, weight: 70.7, bmi: 24.7, smoker: "No", exercise: "1-2/wk", diet: "Good", alcohol: "High", disease: "No", stress: 2, sleep: 5.9 },
  { id: 3, age: 46, gender: "Female", height: 159.1, weight: 69.0, bmi: 27.3, smoker: "No", exercise: "Daily", diet: "Excellent", alcohol: "Moderate", disease: "No", stress: 3, sleep: 4.8 },
  { id: 4, age: 32, gender: "Male", height: 170.6, weight: 76.4, bmi: 26.3, smoker: "No", exercise: "3-5/wk", diet: "Excellent", alcohol: "Moderate", disease: "No", stress: 9, sleep: 6.6 },
  { id: 5, age: 60, gender: "Male", height: 158.4, weight: 60.4, bmi: 24.1, smoker: "No", exercise: "3-5/wk", diet: "Excellent", alcohol: "Low", disease: "Yes", stress: 6, sleep: 6.1 },
]

export function DatasetOverview() {
  return (
    <div className="flex flex-col gap-6">
      {/* Feature descriptions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Feature Descriptions</CardTitle>
          <CardDescription>
            13 attributes across personal, lifestyle, and health dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Range</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.name}>
                  <TableCell className="font-mono text-sm font-medium text-card-foreground">
                    {f.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={f.type === "Numeric" ? "default" : f.type === "Binary" ? "secondary" : "outline"}
                      className={
                        f.type === "Numeric"
                          ? "bg-primary/15 text-primary border-transparent hover:bg-primary/20"
                          : f.type === "Binary"
                            ? "bg-success/15 text-success border-transparent hover:bg-success/20"
                            : ""
                      }
                    >
                      {f.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {f.range}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {f.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sample data */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Sample Data (First 5 Records)</CardTitle>
          <CardDescription>
            Preview of the synthetic health and lifestyle dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>Smoker</TableHead>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Diet</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Stress</TableHead>
                  <TableHead>Sleep</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-card-foreground">{row.id}</TableCell>
                    <TableCell className="text-muted-foreground">{row.age}</TableCell>
                    <TableCell className="text-muted-foreground">{row.gender}</TableCell>
                    <TableCell className="text-muted-foreground">{row.bmi}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          row.smoker === "Yes"
                            ? "bg-destructive/15 text-destructive border-transparent"
                            : "bg-success/15 text-success border-transparent"
                        }
                      >
                        {row.smoker}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.exercise}</TableCell>
                    <TableCell className="text-muted-foreground">{row.diet}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          row.disease === "Yes"
                            ? "bg-destructive/15 text-destructive border-transparent"
                            : "bg-success/15 text-success border-transparent"
                        }
                      >
                        {row.disease}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.stress}</TableCell>
                    <TableCell className="text-muted-foreground">{row.sleep}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
