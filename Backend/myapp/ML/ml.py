import os
from typing import Any

import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_CANDIDATES = (
    os.path.join(BASE_DIR, "health_model_pipeline.pkl"),
    os.path.join(BASE_DIR, "RFC.pkl"),
)

MODEL_WEIGHT = 0.15
RULE_WEIGHT = 0.85

GENDER_MAP = {
    "male": "Male",
    "m": "Male",
    "female": "Female",
    "f": "Female",
    "other": "Other",
}

SMOKER_MAP = {
    "yes": "Yes",
    "true": "Yes",
    "1": "Yes",
    "no": "No",
    "false": "No",
    "0": "No",
}

ALCOHOL_MAP = {
    "none": "Low",
    "low": "Low",
    "moderate": "Moderate",
    "high": "High",
}

EXERCISE_MAP = {
    "none": "None",
    "0": "None",
    "1-2": "1-2 times/week",
    "1-2 times/week": "1-2 times/week",
    "3-5": "3-5 times/week",
    "3-5 times/week": "3-5 times/week",
    "daily": "Daily",
    "everyday": "Daily",
}

DIET_MAP = {
    "poor": "Poor",
    "average": "Average",
    "good": "Good",
    "excellent": "Excellent",
}


def load_pipeline():
    last_error = None
    for model_path in MODEL_CANDIDATES:
        if not os.path.exists(model_path):
            continue
        try:
            pipeline = joblib.load(model_path)
            print(f"Model loaded successfully from: {model_path}")
            return pipeline
        except Exception as exc:  # pragma: no cover
            last_error = exc
    if last_error is not None:
        raise RuntimeError(f"Failed to load model: {last_error}") from last_error
    raise RuntimeError("No model file found in ML directory.")


loaded_pipeline = load_pipeline()


def normalized(value: Any) -> str:
    return str(value).strip().lower()


def get_mapped(mapping: dict[str, str], raw_value: Any, field_name: str) -> str:
    key = normalized(raw_value)
    if key not in mapping:
        allowed = ", ".join(sorted(mapping))
        raise ValueError(f"Unsupported value for '{field_name}': {raw_value}. Allowed: {allowed}")
    return mapping[key]


def prepare_dataframe(data: dict) -> pd.DataFrame:
    required_fields = [
        "age",
        "height",
        "weight",
        "bmi",
        "stressLevel",
        "sleepHours",
        "gender",
        "smoker",
        "exercise",
        "diet",
        "alcohol",
    ]
    missing = [field for field in required_fields if field not in data and field != "bmi"]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    height_cm = float(data["height"])
    weight_kg = float(data["weight"])
    bmi = float(data["bmi"]) if "bmi" in data and data["bmi"] not in ("", None) else weight_kg / ((height_cm / 100) ** 2)

    return pd.DataFrame(
        [
            {
                "Age": int(data["age"]),
                "Height_cm": height_cm,
                "Weight_kg": weight_kg,
                "BMI": bmi,
                "Stress_Level": int(data["stressLevel"]),
                "Sleep_Hours": float(data["sleepHours"]),
                "Gender": get_mapped(GENDER_MAP, data["gender"], "gender"),
                "Smoker": get_mapped(SMOKER_MAP, data["smoker"], "smoker"),
                "Exercise_Freq": get_mapped(EXERCISE_MAP, data["exercise"], "exercise"),
                "Diet_Quality": get_mapped(DIET_MAP, data["diet"], "diet"),
                "Alcohol_Consumption": get_mapped(ALCOHOL_MAP, data["alcohol"], "alcohol"),
            }
        ]
    )


def rule_based_risk(data: dict) -> float:
    age = int(data["age"])
    height_cm = float(data["height"])
    weight_kg = float(data["weight"])
    bmi = float(data["bmi"]) if "bmi" in data and data["bmi"] not in ("", None) else weight_kg / ((height_cm / 100) ** 2)
    stress = int(data["stressLevel"])
    sleep = float(data["sleepHours"])
    smoker = normalized(data["smoker"])
    alcohol = normalized(data["alcohol"])
    exercise = normalized(data["exercise"])
    diet = normalized(data["diet"])

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


def get_model_positive_probability(df: pd.DataFrame) -> float:
    if not hasattr(loaded_pipeline, "predict_proba"):
        return 0.0

    proba_row = loaded_pipeline.predict_proba(df)[0]
    classes = list(getattr(loaded_pipeline, "classes_", []))

    positive_aliases = {"1", "yes", "true", "positive", "high"}
    negative_aliases = {"0", "no", "false", "negative", "low"}

    positive_index = None
    negative_index = None

    for idx, cls in enumerate(classes):
        cls_norm = normalized(cls)
        if cls_norm in positive_aliases and positive_index is None:
            positive_index = idx
        if cls_norm in negative_aliases and negative_index is None:
            negative_index = idx

    if positive_index is None and len(proba_row) == 2:
        if negative_index is not None:
            positive_index = 1 - negative_index
        elif len(classes) == 2:
            # For binary sklearn classifiers, classes_ are sorted and positive is commonly index 1.
            positive_index = 1

    if positive_index is not None and positive_index < len(proba_row):
        return float(proba_row[positive_index])

    return 0.5


def predict_health(data: dict) -> dict:
    df = prepare_dataframe(data)
    model_proba_yes = get_model_positive_probability(df)
    rules_proba_yes = rule_based_risk(data)

    combined_proba_yes = (MODEL_WEIGHT * model_proba_yes) + (RULE_WEIGHT * rules_proba_yes)
    combined_proba_yes = min(1.0, max(0.0, combined_proba_yes))

    if rules_proba_yes >= 0.78:
        combined_proba_yes = max(combined_proba_yes, 0.75)

    if combined_proba_yes > 0.7 or rules_proba_yes >= 0.6:
        risk_level = "High"
    elif combined_proba_yes > 0.4:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "chronicDisease": combined_proba_yes >= 0.5,
        "confidence": round(combined_proba_yes * 100, 2),
        "probability": round(combined_proba_yes * 100, 2),
        "riskLevel": risk_level,
    }
