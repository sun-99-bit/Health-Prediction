import os

import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "health_model_pipeline.pkl")

loaded_pipeline = joblib.load(MODEL_PATH)
print("Model loaded successfully!")

# The trained model has weak signal on the current dataset.
# Keep it as a secondary signal and rely more on stable rules.
MODEL_WEIGHT = 0.15
RULE_WEIGHT = 0.85


GENDER_MAP = {
    "male": "Male",
    "female": "Female",
}

SMOKER_MAP = {
    "yes": "Yes",
    "no": "No",
}

ALCOHOL_MAP = {
    # Model was trained without a "None" alcohol class.
    # Map UI "none" to the lowest known category.
    "none": "Low",
    "low": "Low",
    "moderate": "Moderate",
    "high": "High",
}

EXERCISE_MAP = {
    # Match OneHotEncoder training categories exactly.
    "none": "1-2 times/week",
    "1-2": "1-2 times/week",
    "3-5": "3-5 times/week",
    "daily": "Daily",
}

DIET_MAP = {
    "poor": "Poor",
    "average": "Average",
    "good": "Good",
    "excellent": "Excellent",
}


def prepare_dataframe(data):
    try:
        return pd.DataFrame(
            [
                {
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
                }
            ]
        )
    except KeyError as e:
        raise ValueError(f"Unsupported input value: {e}")


def rule_based_risk(data: dict) -> float:
    age = int(data["age"])
    bmi = float(data["bmi"])
    stress = int(data["stressLevel"])
    sleep = float(data["sleepHours"])
    smoker = data["smoker"].lower()
    alcohol = data["alcohol"].lower()
    exercise = data["exercise"].lower()
    diet = data["diet"].lower()

    score = 0.0

    if age >= 70:
        score += 0.22
    elif age >= 60:
        score += 0.16
    elif age >= 45:
        score += 0.10

    if bmi >= 35 or bmi < 18.5:
        score += 0.18
    elif bmi >= 30:
        score += 0.12
    elif bmi >= 25:
        score += 0.06

    if smoker == "yes":
        score += 0.18

    if alcohol == "high":
        score += 0.12
    elif alcohol == "moderate":
        score += 0.06

    if exercise == "none":
        score += 0.14
    elif exercise == "1-2":
        score += 0.07

    if diet == "poor":
        score += 0.12
    elif diet == "average":
        score += 0.06

    if stress >= 8:
        score += 0.10
    elif stress >= 6:
        score += 0.06
    elif stress >= 4:
        score += 0.03

    if sleep < 5:
        score += 0.10
    elif sleep < 6:
        score += 0.06
    elif sleep > 9.5:
        score += 0.04

    return min(score, 1.0)


def normalize_model_prediction(prediction) -> bool:
    if isinstance(prediction, str):
        return prediction.strip().lower() in {"1", "yes", "true", "positive", "high"}
    return int(prediction) == 1


def get_proba_yes(df: pd.DataFrame):
    if not hasattr(loaded_pipeline, "predict_proba"):
        return None

    proba_row = loaded_pipeline.predict_proba(df)[0]
    classes = list(getattr(loaded_pipeline, "classes_", []))

    yes_index = None
    for idx, cls in enumerate(classes):
        if str(cls).strip().lower() in {"1", "yes", "true", "positive", "high"}:
            yes_index = idx
            break

    if yes_index is not None and yes_index < len(proba_row):
        return float(proba_row[yes_index])

    return float(max(proba_row))


def predict_health(data: dict):
    try:
        df = prepare_dataframe(data)

        prediction = loaded_pipeline.predict(df)[0]
        model_label = normalize_model_prediction(prediction)
        model_proba_yes = get_proba_yes(df)
        if model_proba_yes is None:
            model_proba_yes = 1.0 if model_label else 0.0

        rules_proba_yes = rule_based_risk(data)
        combined_proba_yes = (MODEL_WEIGHT * model_proba_yes) + (RULE_WEIGHT * rules_proba_yes)
        # Ensure obviously risky profiles are not under-called due to weak model calibration.
        if rules_proba_yes >= 0.78:
            combined_proba_yes = max(combined_proba_yes, 0.75)
        chronic_disease = combined_proba_yes >= 0.5

        return {
            "chronicDisease": chronic_disease,
            "confidence": round(combined_proba_yes * 100, 2),
            "riskLevel": (
                "High" if combined_proba_yes > 0.7 else
                "Medium" if combined_proba_yes > 0.4 else
                "Low"
            ),
        }

    except Exception as e:
        print("Prediction error:", e)
        raise e
