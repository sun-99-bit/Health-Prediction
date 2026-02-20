import argparse
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


FEATURE_COLUMNS = [
    "Age",
    "Gender",
    "Height_cm",
    "Weight_kg",
    "BMI",
    "Smoker",
    "Exercise_Freq",
    "Diet_Quality",
    "Alcohol_Consumption",
    "Stress_Level",
    "Sleep_Hours",
]

TARGET_COLUMN = "Chronic_Disease"
POSITIVE_LABEL = "Yes"

NUMERIC_COLUMNS = ["Age", "Height_cm", "Weight_kg", "BMI", "Stress_Level", "Sleep_Hours"]
CATEGORICAL_COLUMNS = ["Gender", "Smoker", "Exercise_Freq", "Diet_Quality", "Alcohol_Consumption"]


def build_preprocessor():
    num_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    cat_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        transformers=[
            ("num", num_pipe, NUMERIC_COLUMNS),
            ("cat", cat_pipe, CATEGORICAL_COLUMNS),
        ]
    )


def get_feature_names(pipeline):
    pre = pipeline.named_steps["preprocessing"]
    return pre.get_feature_names_out()


def get_positive_probability(pipeline, x):
    proba = pipeline.predict_proba(x)
    classes = list(pipeline.classes_)
    pos_idx = classes.index(POSITIVE_LABEL)
    return proba[:, pos_idx]


def print_metrics(name, y_true, y_pred, y_proba):
    print(f"\n=== {name} ===")
    print("Confusion Matrix:")
    print(confusion_matrix(y_true, y_pred, labels=["No", "Yes"]))
    print(f"ROC-AUC: {roc_auc_score((y_true == POSITIVE_LABEL).astype(int), y_proba):.4f}")
    print("Classification Report:")
    print(classification_report(y_true, y_pred, digits=4))


def print_feature_importance(model_name, pipeline, top_k=20):
    feature_names = get_feature_names(pipeline)
    model = pipeline.named_steps["model"]

    print(f"\nTop {top_k} Feature Importance ({model_name}):")

    if hasattr(model, "feature_importances_"):
        scores = model.feature_importances_
    elif hasattr(model, "coef_"):
        coef = model.coef_
        scores = np.abs(coef[0] if coef.ndim > 1 else coef)
    else:
        print("Feature importance not available for this model.")
        return

    pairs = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)[:top_k]
    for idx, (fname, score) in enumerate(pairs, start=1):
        print(f"{idx:>2}. {fname}: {score:.6f}")


def train_and_select_model(df, random_state):
    df = df.copy()
    df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(str).str.strip().str.title()

    x = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=random_state,
        stratify=y,
    )

    candidates = {
        "LogisticRegression": LogisticRegression(max_iter=2000, class_weight="balanced"),
        "RandomForest": RandomForestClassifier(
            n_estimators=500,
            random_state=random_state,
            class_weight="balanced_subsample",
            min_samples_leaf=2,
            n_jobs=-1,
        ),
    }

    best_name = None
    best_pipeline = None
    best_auc = -1.0

    for name, estimator in candidates.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessing", build_preprocessor()),
                ("model", estimator),
            ]
        )
        pipeline.fit(x_train, y_train)

        y_pred = pipeline.predict(x_test)
        y_proba = get_positive_probability(pipeline, x_test)
        auc = roc_auc_score((y_test == POSITIVE_LABEL).astype(int), y_proba)

        print_metrics(name, y_test, y_pred, y_proba)
        print_feature_importance(name, pipeline, top_k=20)

        if auc > best_auc:
            best_auc = auc
            best_name = name
            best_pipeline = pipeline

    print(f"\nSelected model: {best_name} (ROC-AUC={best_auc:.4f})")
    return best_pipeline


def main():
    parser = argparse.ArgumentParser(description="Train and validate chronic disease model.")
    parser.add_argument(
        "--dataset",
        default=r"d:\ML_1\archive\synthetic_health_lifestyle_dataset.csv",
        help="Path to input CSV dataset.",
    )
    parser.add_argument(
        "--output",
        default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "health_model_pipeline.pkl"),
        help="Path to save trained model pipeline (.pkl).",
    )
    parser.add_argument("--random-state", type=int, default=42, help="Random seed.")
    args = parser.parse_args()

    df = pd.read_csv(args.dataset)
    missing = [c for c in FEATURE_COLUMNS + [TARGET_COLUMN] if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset missing required columns: {missing}")

    model = train_and_select_model(df, args.random_state)
    joblib.dump(model, args.output)
    print(f"Saved model pipeline to: {args.output}")


if __name__ == "__main__":
    main()
