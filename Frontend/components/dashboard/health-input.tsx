"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
import { Activity, Loader2, HeartPulse } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)

  // ---------------- BMI ----------------
  const bmi = useMemo(() => {
    const h = parseFloat(form.height) / 100
    const w = parseFloat(form.weight)
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1)
    return "—"
  }, [form.height, form.weight])

  // ---------------- Predict ----------------
  const handlePredict = async () => {
    setLoading(true)
    setPrediction(null)
    setError(null)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          gender: form.gender,
          height: Number(form.height),
          weight: Number(form.weight),
          bmi: bmi === "—" ? 0 : Number(bmi),
          smoker: form.smoker,
          alcohol: form.alcohol,
          exercise: form.exercise,
          diet: form.diet,
          sleepHours: form.sleepHours[0],
          stressLevel: form.stressLevel[0],
        }),
      })

      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setPrediction(data)
    } catch (err: any) {
      setError(err.message || "Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Card className="border-muted/40 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">
                Health Risk Assessment
              </CardTitle>
              <CardDescription>
                Fill in your health details to predict chronic disease risk
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField label="Age" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            <SelectField label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })}
              options={[["male","Male"],["female","Female"],["other","Other"]]} />

            <InputField label="Height (cm)" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
            <InputField label="Weight (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />

            <div className="flex flex-col gap-2">
              <Label>BMI (Auto)</Label>
              <Input
                readOnly
                value={bmi}
                className="bg-muted font-mono text-center"
              />
            </div>

            <SelectField label="Smoking" value={form.smoker} onChange={(v) => setForm({ ...form, smoker: v })}
              options={[["yes","Yes"],["no","No"]]} />

            <SelectField label="Alcohol Consumption" value={form.alcohol}
              onChange={(v) => setForm({ ...form, alcohol: v })}
              options={[["none","None"],["low","Low"],["moderate","Moderate"],["high","High"]]} />

            <SelectField label="Exercise Frequency" value={form.exercise}
              onChange={(v) => setForm({ ...form, exercise: v })}
              options={[["none","None"],["1-2","1–2 / week"],["3-5","3–5 / week"],["daily","Daily"]]} />

            <SelectField label="Diet Quality" value={form.diet}
              onChange={(v) => setForm({ ...form, diet: v })}
              options={[["poor","Poor"],["good","Good"],["excellent","Excellent"]]} />

            <SliderField
              label={`Sleep Hours: ${form.sleepHours[0]} h`}
              value={form.sleepHours}
              min={3}
              max={10}
              step={0.5}
              onChange={(v) => setForm({ ...form, sleepHours: v })}
            />

            <SliderField
              label={`Stress Level: ${form.stressLevel[0]} / 10`}
              value={form.stressLevel}
              min={1}
              max={10}
              step={1}
              onChange={(v) => setForm({ ...form, stressLevel: v })}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handlePredict}
              disabled={loading}
              className="gap-2 px-8"
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

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <PredictionResult prediction={prediction} />
      </div>
    </div>
  )
}

/* ---------------- Reusable UI Components ---------------- */

function InputField({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, l]: any) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function SliderField({ label, value, min, max, step, onChange }: any) {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
      />
    </div>
  )
}
