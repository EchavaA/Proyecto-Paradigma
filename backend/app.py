from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Ruta de Tesseract en Windows (cambiar si es necesario)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

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

    # Aquí puedes implementar lógica para analizar la confiabilidad
    # Por simplicidad, asumimos que cualquier texto con "falso" no es confiable
    is_reliable = "falso" not in full_text.lower()

    return jsonify({
        "message": "La noticia es confiable." if is_reliable else "La noticia NO es confiable.",
        "isReliable": is_reliable
    })

if __name__ == "__main__":
    app.run(debug=True)
