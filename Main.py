from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.preprocessing.image import img_to_array, load_img

app = Flask(__name__)
CORS(app)

# Load your trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'Fruit_Classifier.h5')
model = tf.keras.models.load_model(model_path)

label_mapping = {
    0: 'apple_fresh',
    1: 'apple_spoiled',
    2: 'banana_fresh',
    3: 'banana_spoiled',
    4: 'carrot_fresh',
    5: 'carrot_spoiled',
    6: 'orange_fresh',
    7: 'orange_spoiled',
    8: 'tomato_fresh',
    9: 'tomato_spoiled'
}

def predict_image(img_path):
    img = load_img(img_path, target_size=(224, 224))
    img = img_to_array(img)
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    pred = model.predict(img)
    pred_idx = np.argmax(pred, axis=-1)[0]
    predicted_label = label_mapping[pred_idx]
    fruit, status = predicted_label.split('_')   # CORRECT ORDER
    return fruit, status

@app.route('/predict', methods=['POST'])
def predict():
    print("Received request:", request)
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    temp_path = os.path.join(BASE_DIR, 'temp_image.jpg')
    file.save(temp_path)
    fruit, status = predict_image(temp_path)      # CORRECT ORDER
    os.remove(temp_path)
    print(f"Prediction response: fruit={fruit}, status={status}")  # Debug print
    return jsonify({
        "fruit": fruit,
        "status": status
    })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
