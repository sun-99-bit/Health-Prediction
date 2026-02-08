"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export interface HealthFormData {
  age: number
  gender: string
  height: number
  weight: number
  bmi: number
  smoker: string
  alcohol: string
  exercise: string
  diet: string
  sleepHours: number
  stressLevel: number
}

interface HealthInputFormProps {
  onPredict: (data: HealthFormData) => void
  isLoading?: boolean
}

export function HealthInputForm({ onPredict, isLoading }: HealthInputFormProps) {
  const [age, setAge] = useState(35)
  const [gender, setGender] = useState("Male")
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)
  const [smoker, setSmoker] = useState("No")
  const [alcohol, setAlcohol] = useState("None")
  const [exercise, setExercise] = useState("3-5")
  const [diet, setDiet] = useState("Good")
  const [sleepHours, setSleepHours] = useState([7])
  const [stressLevel, setStressLevel] = useState([5])

  const bmi = useMemo(() => {
    if (height > 0 && weight > 0) {
      return Number.parseFloat(((weight / (height / 100) ** 2)).toFixed(1))
    }
    return 0
  }, [height, weight])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPredict({
      age,
      gender,
      height,
      weight,
      bmi,
      smoker,
      alcohol,
      exercise,
      diet,
      sleepHours: sleepHours[0],
      stressLevel: stressLevel[0],
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Activity className="h-5 w-5 text-primary" />
          Health Input
        </CardTitle>
        <CardDescription>
          Enter patient data to predict chronic disease risk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Row 1: Age, Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="age" className="text-card-foreground">Age</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender" className="text-card-foreground">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Height, Weight, BMI */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="height" className="text-card-foreground">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min={100}
                max={250}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight" className="text-card-foreground">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={20}
                max={200}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bmi" className="text-card-foreground">BMI (auto)</Label>
              <Input
                id="bmi"
                type="text"
                value={bmi}
                readOnly
                className="bg-muted font-semibold text-card-foreground"
              />
            </div>
          </div>

          {/* Row 3: Smoking, Alcohol */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="smoker" className="text-card-foreground">Smoking Status</Label>
              <Select value={smoker} onValueChange={setSmoker}>
                <SelectTrigger id="smoker">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="alcohol" className="text-card-foreground">Alcohol Consumption</Label>
              <Select value={alcohol} onValueChange={setAlcohol}>
                <SelectTrigger id="alcohol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Exercise, Diet */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="exercise" className="text-card-foreground">Exercise Frequency</Label>
              <Select value={exercise} onValueChange={setExercise}>
                <SelectTrigger id="exercise">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="1-2">1-2 times/week</SelectItem>
                  <SelectItem value="3-5">3-5 times/week</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="diet" className="text-card-foreground">Diet Quality</Label>
              <Select value={diet} onValueChange={setDiet}>
                <SelectTrigger id="diet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: Sliders */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-card-foreground">Sleep Hours</Label>
                <span className="text-sm font-semibold text-primary">
                  {sleepHours[0]}h
                </span>
              </div>
              <Slider
                value={sleepHours}
                onValueChange={setSleepHours}
                min={3}
                max={10}
                step={0.5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3h</span>
                <span>10h</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-card-foreground">Stress Level</Label>
                <span className="text-sm font-semibold text-primary">
                  {stressLevel[0]}/10
                </span>
              </div>
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                min={1}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (1)</span>
                <span>High (10)</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Predict Health Risk
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
