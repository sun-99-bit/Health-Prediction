import pandas as pd
import joblib
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "health_model_pipeline.pkl")

loaded_pipeline = joblib.load(MODEL_PATH)
print("Model loaded successfully!")



GENDER_MAP = {
    "male": "Male",
    "female": "Female"
}

SMOKER_MAP = {
    "yes": "Yes",
    "no": "No"
}

ALCOHOL_MAP = {
    "none": "None",
    "low": "Low",
    "moderate": "Moderate",
    "high": "High"
}

EXERCISE_MAP = {
    "none": "None",
    "1-2": "1-2",
    "3-5": "3-5",
    "daily": "Daily"
}

DIET_MAP = {
    "poor": "Poor",
    "average": "Average",
    "good": "Good",
    "excellent": "Excellent"
}



def prepare_dataframe(data):
    try:
        df = pd.DataFrame([{
            "Age": int(data["age"]),
            "Height_cm": int(data["height"]),
            "Weight_kg": int(data["weight"]),
            "BMI": float(data["bmi"]),
            "Stress_Level": int(data["stressLevel"]),
            "Sleep_Hours": float(data["sleepHours"]),

            "Gender": GENDER_MAP[data["gender"].lower()],
            "Smoker": SMOKER_MAP[data["smoker"].lower()],
            "Alcohol_Consumption": ALCOHOL_MAP[data["alcohol"].lower()],
            "Exercise_Freq": EXERCISE_MAP[data["exercise"].lower()],
            "Diet_Quality": DIET_MAP[data["diet"].lower()],
        }])

        return df

    except KeyError as e:
        raise ValueError(f"Unsupported input value: {e}")



def predict_health(data: dict):
    try:
        df = prepare_dataframe(data)

        prediction = loaded_pipeline.predict(df)[0]

        confidence = None
        if hasattr(loaded_pipeline, "predict_proba"):
            confidence = max(loaded_pipeline.predict_proba(df)[0])

        return {
            "chronicDisease": bool(prediction),
            "confidence": round(confidence * 100, 2) if confidence else None,
            "riskLevel": (
                "High" if confidence and confidence > 0.7 else
                "Medium" if confidence and confidence > 0.4 else
                "Low"
            )
        }

    except Exception as e:
        print("Prediction error:", e)
        raise e
