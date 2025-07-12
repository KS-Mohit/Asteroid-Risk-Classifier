import streamlit as st
import pandas as pd
import numpy as np
import joblib

# Load model and transformers
model = joblib.load("neo_model.pkl")
scaler = joblib.load("scaler.pkl")
imputer = joblib.load("imputer.pkl")

# Define the input features
feature_cols = [
    'Semi-Major axis', 'eccentricity', 'Inclination with respect to x-y ecliptic plane(deg)',
    'Longitude of the ascending node', 'argument of perihelion', 'perihelion distance(au)',
    'aphelion distance(au)', 'Orbital period(YEARS)', 'data arc-span(d)',
    'Absolute Magnitude parameter', 'Earth Minimum orbit Intersection Distance(au)'
]

st.title("🚀 Asteroid Risk Classification App")
st.markdown("Predicts if an asteroid is **Low**, **Medium**, or **High** risk based on its orbital and physical properties.")

# Upload CSV or manual input
upload = st.file_uploader("Upload a CSV file (optional)", type=["csv"])

if upload is not None:
    df_input = pd.read_csv(upload)
    st.write("Uploaded data preview:")
    st.dataframe(df_input)
else:
    st.subheader("Or Enter Data Manually")
    input_data = []
    for col in feature_cols:
        val = st.number_input(f"{col}:", value=0.0)
        input_data.append(val)
    df_input = pd.DataFrame([input_data], columns=feature_cols)

# Predict
if st.button("Predict Risk Level"):
    df_proc = imputer.transform(df_input)
    df_proc_scaled = scaler.transform(df_proc)
    preds = model.predict(df_proc_scaled)
    
    label_map = {0: "🟢 Low Risk", 1: "🟡 Medium Risk", 2: "🔴 High Risk"}
    pred_labels = [label_map[p] for p in preds]

    st.subheader("🛰 Prediction Results")
    df_input['Predicted Risk Level'] = pred_labels
    st.dataframe(df_input)
