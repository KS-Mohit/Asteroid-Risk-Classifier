'use client'

import { useState } from "react";

// Input feature names
const featureCols = [
  "Semi-Major axis", "eccentricity", "Inclination (deg)",
  "Longitude of ascending node", "Argument of perihelion",
  "Perihelion distance (au)", "Aphelion distance (au)",
  "Orbital period (years)", "Data arc-span (d)",
  "Absolute magnitude", "Earth MOID (au)"
];

// Random value ranges (min, max) for each feature
const randomRanges: Record<string, [number, number]> = {
  "Semi-Major axis": [1.5, 3.5],
  "eccentricity": [0.0, 0.9],
  "Inclination (deg)": [0, 30],
  "Longitude of ascending node": [0, 360],
  "Argument of perihelion": [0, 360],
  "Perihelion distance (au)": [0.1, 2.5],
  "Aphelion distance (au)": [1.5, 4.0],
  "Orbital period (years)": [0.5, 10],
  "Data arc-span (d)": [100, 90000],
  "Absolute magnitude": [10, 30],
  "Earth MOID (au)": [0.01, 1.0],
};

export default function AsteroidForm() {
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(featureCols.map((col) => [col, ""]))
  );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleRandomize = () => {
    const randomized = Object.fromEntries(
      featureCols.map((col) => {
        const [min, max] = randomRanges[col];
        const randomVal = (Math.random() * (max - min) + min).toFixed(4);
        return [col, randomVal];
      })
    );
    setFormValues(randomized);
    setResult(null); // Clear old result
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: Object.values(formValues).map(Number) }),
      });

      const data = await res.json();
      const labelMap = ["🟢 Low Risk", "🟡 Medium Risk", "🔴 High Risk"];
      setResult(labelMap[data.prediction]);
    } catch (err) {
      setResult("❌ Error predicting. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6">
        Enter Asteroid Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featureCols.map((col) => (
          <div key={col} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{col}</label>
            <input
              type="number"
              step="any"
              className="bg-black border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formValues[col] ?? ""}
              onChange={(e) => handleChange(col, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
        <button
          onClick={handleRandomize}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition"
        >
          🎲 Randomize Values
        </button>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition"
        >
          {loading ? "Predicting..." : "🚀 Predict Risk"}
        </button>
      </div>

      {result && (
        <div className="mt-6 text-center text-xl font-semibold text-gray-300">
          Prediction: {result}
        </div>
      )}
    </div>
  );
}
