from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load('neo_model.pkl')
scaler = joblib.load('scaler.pkl')
imputer = joblib.load('imputer.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['features']
    arr = np.array(data).reshape(1, -1)
    arr_imp = imputer.transform(arr)
    arr_scaled = scaler.transform(arr_imp)
    prediction = int(model.predict(arr_scaled)[0])
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(port=5000)
