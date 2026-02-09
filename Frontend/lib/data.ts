// Synthetic chart data derived from the Health & Lifestyle dataset

export const ageGroupData = [
  { ageGroup: "18-25", chronicRate: 22.4, total: 1050 },
  { ageGroup: "26-35", chronicRate: 25.1, total: 1320 },
  { ageGroup: "36-45", chronicRate: 28.7, total: 1410 },
  { ageGroup: "46-55", chronicRate: 31.2, total: 1280 },
  { ageGroup: "56-65", chronicRate: 34.8, total: 1190 },
  { ageGroup: "66-75", chronicRate: 38.6, total: 850 },
  { ageGroup: "75+", chronicRate: 42.1, total: 400 },
]

export const bmiDistributionData = [
  { range: "< 18.5", count: 420, label: "Underweight" },
  { range: "18.5-24.9", count: 2850, label: "Normal" },
  { range: "25-29.9", count: 2480, label: "Overweight" },
  { range: "30-34.9", count: 1150, label: "Obese I" },
  { range: "35-39.9", count: 420, label: "Obese II" },
  { range: "40+", count: 180, label: "Obese III" },
]

export const sleepStressData = [
  { sleepHours: 3.5, stressLevel: 9, chronic: "Yes" },
  { sleepHours: 4.0, stressLevel: 8, chronic: "No" },
  { sleepHours: 4.5, stressLevel: 7, chronic: "Yes" },
  { sleepHours: 5.0, stressLevel: 6, chronic: "No" },
  { sleepHours: 5.2, stressLevel: 9, chronic: "Yes" },
  { sleepHours: 5.5, stressLevel: 5, chronic: "No" },
  { sleepHours: 5.8, stressLevel: 8, chronic: "Yes" },
  { sleepHours: 6.0, stressLevel: 4, chronic: "No" },
  { sleepHours: 6.2, stressLevel: 7, chronic: "No" },
  { sleepHours: 6.3, stressLevel: 3, chronic: "No" },
  { sleepHours: 6.5, stressLevel: 6, chronic: "Yes" },
  { sleepHours: 6.8, stressLevel: 5, chronic: "No" },
  { sleepHours: 7.0, stressLevel: 2, chronic: "No" },
  { sleepHours: 7.2, stressLevel: 4, chronic: "No" },
  { sleepHours: 7.5, stressLevel: 3, chronic: "No" },
  { sleepHours: 7.8, stressLevel: 6, chronic: "Yes" },
  { sleepHours: 8.0, stressLevel: 1, chronic: "No" },
  { sleepHours: 8.2, stressLevel: 2, chronic: "No" },
  { sleepHours: 8.5, stressLevel: 4, chronic: "No" },
  { sleepHours: 9.0, stressLevel: 3, chronic: "No" },
  { sleepHours: 9.5, stressLevel: 1, chronic: "No" },
  { sleepHours: 4.2, stressLevel: 10, chronic: "Yes" },
  { sleepHours: 3.8, stressLevel: 7, chronic: "Yes" },
  { sleepHours: 5.1, stressLevel: 8, chronic: "No" },
  { sleepHours: 6.7, stressLevel: 5, chronic: "No" },
  { sleepHours: 7.3, stressLevel: 2, chronic: "No" },
  { sleepHours: 8.8, stressLevel: 3, chronic: "No" },
  { sleepHours: 4.8, stressLevel: 9, chronic: "Yes" },
  { sleepHours: 5.6, stressLevel: 7, chronic: "No" },
  { sleepHours: 6.1, stressLevel: 6, chronic: "Yes" },
]

export const modelPerformanceData = [
  { model: "Logistic Regression", accuracy: 80.67, precision: 79.2, recall: 81.5, f1: 80.3, isBest: true },
  { model: "Random Forest", accuracy: 80.67, precision: 80.1, recall: 79.8, f1: 79.9, isBest: false },
  { model: "Gradient Boosting", accuracy: 80.60, precision: 79.8, recall: 80.2, f1: 80.0, isBest: false },
  { model: "Support Vector Machine", accuracy: 80.67, precision: 80.3, recall: 79.5, f1: 79.9, isBest: false },
  { model: "KNN", accuracy: 77.87, precision: 76.5, recall: 78.2, f1: 77.3, isBest: false },
  { model: "Decision Tree", accuracy: 66.47, precision: 65.1, recall: 67.2, f1: 66.1, isBest: false },
  { model: "Naive Bayes", accuracy: 80.67, precision: 79.9, recall: 80.1, f1: 80.0, isBest: false },
]

export const datasetSummary = {
  totalRecords: 7500,
  features: 13,
  bestModel: "Logistic Regression",
  bestAccuracy: 80.67,
  genderDistribution: { Male: 2520, Female: 2480, Other: 2500 },
  chronicDisease: { Yes: 2250, No: 5250 },
  avgAge: 42.3,
  avgBMI: 26.1,
  avgSleepHours: 6.8,
  avgStressLevel: 5.4,
}

export const featureList = [
  { name: "Age", type: "Numeric", description: "Age of the individual (18-80)" },
  { name: "Gender", type: "Categorical", description: "Male, Female, or Other" },
  { name: "Height_cm", type: "Numeric", description: "Height in centimeters" },
  { name: "Weight_kg", type: "Numeric", description: "Weight in kilograms" },
  { name: "BMI", type: "Numeric", description: "Body Mass Index (calculated)" },
  { name: "Smoker", type: "Binary", description: "Smoking status (Yes/No)" },
  { name: "Exercise_Freq", type: "Categorical", description: "Exercise frequency" },
  { name: "Diet_Quality", type: "Categorical", description: "Quality of diet" },
  { name: "Alcohol_Consumption", type: "Categorical", description: "Level of consumption" },
  { name: "Chronic_Disease", type: "Binary", description: "Target variable (Yes/No)" },
  { name: "Stress_Level", type: "Numeric", description: "Stress level (1-10)" },
  { name: "Sleep_Hours", type: "Numeric", description: "Average sleep hours" },
  { name: "ID", type: "Numeric", description: "Unique identifier" },
]
