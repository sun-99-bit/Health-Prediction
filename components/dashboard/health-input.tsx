"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Activity, Loader2 } from "lucide-react"
import { PredictionResult, type PredictionData } from "./prediction-result"

interface FormData {
  age: string
  gender: string
  height: string
  weight: string
  smoker: string
  alcohol: string
  exercise: string
  diet: string
  sleepHours: number[]
  stressLevel: number[]
}

export function HealthInput() {
  const [form, setForm] = useState<FormData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    smoker: "",
    alcohol: "",
    exercise: "",
    diet: "",
    sleepHours: [7],
    stressLevel: [5],
  })
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [showResult, setShowResult] = useState(false)

  const bmi = useMemo(() => {
    const h = parseFloat(form.height) / 100
    const w = parseFloat(form.weight)
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1)
    }
    return "—"
  }, [form.height, form.weight])

  const handlePredict = () => {
    setLoading(true)
    setPrediction(null)

    // Simulated prediction logic (placeholder for POST /predict)
    setTimeout(() => {
      const bmiVal = Number.parseFloat(bmi) || 25
      const stress = form.stressLevel[0]
      const sleep = form.sleepHours[0]
      const isSmoker = form.smoker === "yes"
      const age = Number.parseInt(form.age) || 40

      let score = 30
      if (bmiVal > 30) score += 20
      else if (bmiVal > 25) score += 10
      if (stress > 7) score += 15
      else if (stress > 5) score += 8
      if (sleep < 5) score += 15
      else if (sleep < 6) score += 8
      if (isSmoker) score += 15
      if (age > 55) score += 10
      else if (age > 40) score += 5

      score = Math.min(score, 98)
      const confidence = 65 + Math.random() * 20
      const riskLevel: "Low" | "Medium" | "High" =
        score > 60 ? "High" : score > 40 ? "Medium" : "Low"

      setPrediction({
        chronicDisease: score > 50,
        confidence: Number.parseFloat(confidence.toFixed(1)),
        riskLevel,
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Health Input</CardTitle>
              <CardDescription>
                Enter health attributes to predict chronic disease risk
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Age */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Height */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>

            {/* BMI */}
            <div className="flex flex-col gap-2">
              <Label>BMI (Auto-calculated)</Label>
              <Input
                readOnly
                value={bmi}
                className="bg-muted font-mono text-foreground"
              />
            </div>

            {/* Smoking */}
            <div className="flex flex-col gap-2">
              <Label>Smoking Status</Label>
              <Select value={form.smoker} onValueChange={(v) => setForm({ ...form, smoker: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alcohol */}
            <div className="flex flex-col gap-2">
              <Label>Alcohol Consumption</Label>
              <Select value={form.alcohol} onValueChange={(v) => setForm({ ...form, alcohol: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exercise */}
            <div className="flex flex-col gap-2">
              <Label>Exercise Frequency</Label>
              <Select value={form.exercise} onValueChange={(v) => setForm({ ...form, exercise: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1-2">1-2 times/week</SelectItem>
                  <SelectItem value="3-5">3-5 times/week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Diet */}
            <div className="flex flex-col gap-2">
              <Label>Diet Quality</Label>
              <Select value={form.diet} onValueChange={(v) => setForm({ ...form, diet: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sleep */}
            <div className="flex flex-col gap-2">
              <Label>
                Sleep Hours: <span className="font-mono font-bold text-primary">{form.sleepHours[0]}h</span>
              </Label>
              <Slider
                min={3}
                max={10}
                step={0.5}
                value={form.sleepHours}
                onValueChange={(v) => setForm({ ...form, sleepHours: v })}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3h</span>
                <span>10h</span>
              </div>
            </div>

            {/* Stress */}
            <div className="flex flex-col gap-2">
              <Label>
                Stress Level: <span className="font-mono font-bold text-primary">{form.stressLevel[0]}/10</span>
              </Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={form.stressLevel}
                onValueChange={(v) => setForm({ ...form, stressLevel: v })}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handlePredict}
              disabled={loading}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Predict Health Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <PredictionResult prediction={prediction} />
    </div>
  )
}
