from flask import Flask, request, jsonify
import ssl
import socket
import validators
from transformers import pipeline

app = Flask(__name__)

# Cargar el pipeline de clasificación de Hugging Face
classifier = pipeline("zero-shot-classification")

# Función para verificar si un sitio tiene un certificado SSL válido
def check_ssl_certificate(url):
    try:
        # Extraer el dominio del URL
        domain = url.split('://')[1] if "://" in url else url
        host = domain.split('/')[0]  # Obtener solo el dominio

        # Conectar al servidor y obtener el certificado SSL
        context = ssl.create_default_context()
        connection = context.wrap_socket(socket.socket(socket.AF_INET), server_hostname=host)
        connection.connect((host, 443))  # Puerto HTTPS
        cert = connection.getpeercert()  # Obtener el certificado

        # Si se obtuvo el certificado, se considera seguro
        if cert:
            return True
    except Exception as e:
        print(f"Error verificando el certificado SSL: {e}")
    return False

# Función para realizar un análisis de IA sobre la seguridad del URL
def ai_security_analysis(url):
    # Etiquetas candidatas para el análisis de seguridad
    candidate_labels = ["seguro", "no seguro", "phishing", "fraudulento"]
    result = classifier(url, candidate_labels)
    return result['labels'][0]  # Devuelve la etiqueta de mayor probabilidad

@app.route('/check-url', methods=['POST'])
def check_url():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'message': 'No se proporcionó un URL'}), 400

    # Verificar si el URL es válido
    if not validators.url(url):
        return jsonify({'message': 'El URL no es válido.'}), 400

    # Verificar si el URL tiene un certificado SSL válido
    if not url.startswith('https://'):
        return jsonify({'message': 'El URL no es seguro (debe usar HTTPS).'}), 400

    # Verificar el certificado SSL
    ssl_valid = check_ssl_certificate(url)

    # Análisis AI para verificar la seguridad del sitio
    ai_analysis = ai_security_analysis(url)

    if ssl_valid and ai_analysis == "seguro":
        return jsonify({'message': 'El URL es seguro y tiene un certificado SSL válido.'}), 200
    else:
        return jsonify({'message': f'El URL no es seguro (Certificado SSL: {ssl_valid}, IA: {ai_analysis}).'}), 400

if __name__ == '__main__':
    app.run(debug=True)