import pandas as pd
import joblib
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "RFC.pkl")

loaded_pipeline = joblib.load(MODEL_PATH)
print("Model loaded successfully!")


GENDER_MAP = {
    "male": "Male",
    "female": "Female",
    "other": "Other"
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
    "1-2": "1-2 times/week",
    "3-5": "3-5 times/week",
    "daily": "Daily"
}

DIET_MAP = {
    "poor": "Poor",
    "average": "Average",
    "good": "Good",
    "excellent": "Excellent"
}


def prepare_dataframe(data: dict) -> pd.DataFrame:
    try:
        return pd.DataFrame([{
            "Age": int(data["age"]),
            "Height_cm": float(data["height"]),
            "Weight_kg": float(data["weight"]),
            "BMI": float(data["bmi"]),
            "Stress_Level": int(data["stressLevel"]),
            "Sleep_Hours": float(data["sleepHours"]),

            "Gender": GENDER_MAP[data["gender"].lower()],
            "Smoker": SMOKER_MAP[data["smoker"].lower()],
            "Exercise_Freq": EXERCISE_MAP[data["exercise"].lower()],
            "Diet_Quality": DIET_MAP[data["diet"].lower()],
            "Alcohol_Consumption": ALCOHOL_MAP[data["alcohol"].lower()],
        }])

    except KeyError as e:
        raise ValueError(f"Unsupported input value: {e}")


def predict_health(data: dict) -> dict:
    df = prepare_dataframe(data)

    
    probability = float(loaded_pipeline.predict_proba(df)[0][1])

    
    threshold = 0.60
    prediction = "Yes" if probability >= threshold else "No"


    if probability >= 0.38:
        risk = "High"
    elif probability >= 0.35:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "chronicDisease": prediction,
        "probability": round(probability * 100, 2),
        "riskLevel": risk
    }
