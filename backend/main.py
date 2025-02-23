from flask import Flask, jsonify, request
from flask_cors import CORS
import os

from ollamaGenerator import get_chat_response_template
from ollamaApi import get_chat_response

from backend.archive.ibmapi import IBM_chat

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (for testing)

@app.route('/')
def index():
    return jsonify({"Choo Choo": "Welcome to your Flask app 🚅"})

@app.route('/generate-ppt', methods=['GET', 'POST', 'OPTIONS'])
def generate_ppt():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
    if request.method == "POST":
        # result = IBM_chat(
        #     request.json['messages']
        # )
        # result = generate_presentation(
        #     request.json['messages']
        # )
        result = get_chat_response(
            request.json['messages']
        )
        print(result)
        response = jsonify({"data": result})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response, 200

@app.route('/generate-template', methods=['GET', 'POST', 'OPTIONS'])
def generate_template():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
    if request.method == "POST":
        result = get_chat_response_template(
            request.json['messages']
        )
        response = jsonify({"data": result})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response, 200

if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
