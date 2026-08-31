import os
import sys
import argparse
import json

def train_ml_pipeline(dataset_path: str, output_dir: str = "models"):
    print(f"[ML PIPELINE] Initializing training pipeline for dataset: '{dataset_path}'...")
    os.makedirs(output_dir, exist_ok=True)

    try:
        import pandas as pd
        import numpy as np
        from sklearn.model_selection import train_test_split
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.metrics import accuracy_score, classification_report
        import joblib

        if os.path.exists(dataset_path):
            df = pd.read_csv(dataset_path)
            print(f"[ML PIPELINE] Dataset loaded: {len(df)} samples, {len(df.columns)} columns.")

            feature_cols = [c for c in df.columns if c not in ('label', 'flow_id', 'protocol')]
            X = df[feature_cols]
            y = df['label']

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
            clf = RandomForestClassifier(n_estimators=100, random_state=42)
            clf.fit(X_train, y_train)

            preds = clf.predict(X_test)
            acc = accuracy_score(y_test, preds)
            print(f"[ML PIPELINE] Model Trained! Accuracy: {acc:.4f}")
            print(classification_report(y_test, preds))

            model_save_path = os.path.join(output_dir, "traffic_classifier.joblib")
            joblib.dump(clf, model_save_path)
            print(f"[ML PIPELINE] Serialized model saved to: {model_save_path}")

            meta = {
                "model_version": "1.0.0",
                "training_dataset": os.path.basename(dataset_path),
                "accuracy": round(acc, 4),
                "features": feature_cols,
                "classes": list(clf.classes_)
            }
            meta_save_path = os.path.join(output_dir, "metadata.json")
            with open(meta_save_path, "w") as f:
                json.dump(meta, f, indent=2)
            print(f"[ML PIPELINE] Metadata saved to: {meta_save_path}")
        else:
            print(f"[ML PIPELINE WARNING] Dataset file '{dataset_path}' not found. Generating default metadata template in '{output_dir}'.")
            meta = {
                "model_version": "1.0.0",
                "status": "training_ready",
                "description": "Run `python train.py --dataset datasets/processed/traffic.csv` once dataset is generated."
            }
            with open(os.path.join(output_dir, "metadata.json"), "w") as f:
                json.dump(meta, f, indent=2)

    except Exception as e:
        print(f"[ML PIPELINE ERROR] {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train IPsec AI Traffic Classifier Model")
    parser.add_argument("--dataset", default="datasets/processed/traffic.csv", help="Path to training dataset CSV")
    parser.add_argument("--output", default="models", help="Directory to save trained model artifacts")
    args = parser.parse_args()

    train_ml_pipeline(args.dataset, args.output)
