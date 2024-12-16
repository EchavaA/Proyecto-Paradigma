from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import pytesseract
from PIL import Image
import os

# Configuración inicial
app = Flask(__name__)
CORS(app)

# Ruta de Tesseract en Windows (modifica si es diferente en tu sistema)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Inicialización del modelo de clasificación
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.route("/verify", methods=["POST"])
def verify_news():
    # Procesar imagen si se envió
    text_from_image = ""
    if "image" in request.files:
        image = request.files["image"]
        img = Image.open(image)
        text_from_image = pytesseract.image_to_string(img)

    # Procesar texto ingresado
    text_from_user = request.form.get("text", "")

    # Combinar texto de la imagen y el texto del usuario
    full_text = f"{text_from_image} {text_from_user}".strip()

    if not full_text:
        return jsonify({"message": "No se proporcionó texto para verificar.", "isReliable": False})

    # Análisis NLP
    labels = ["real", "falso", "propaganda", "verdadero"]
    result = classifier(full_text, labels)
    main_label = result['labels'][0]
    confidence = result['scores'][0]

    # Construcción de la respuesta
    is_reliable = main_label == "real" or main_label == "verdadero"
    return jsonify({
        "message": f"La noticia parece ser '{main_label}' con una confianza de {confidence:.2f}.",
        "isReliable": is_reliable
    })

if __name__ == "__main__":
    app.run(debug=True)
