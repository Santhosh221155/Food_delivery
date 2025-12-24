import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
PORT = int(os.getenv('PORT', '5000'))
MONGODB_URI = os.getenv('MONGODB_URI')

mongo_status = 'disconnected'
if MONGODB_URI:
  try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    mongo_status = 'connected'
  except Exception as exc:
    mongo_status = f'error: {exc}'

@app.get('/healthz')
def health():
  return jsonify({"status":"ok", "service":"flask-service", "mongo": mongo_status})

@app.get('/internal/menu/<restaurant_id>')
def menu(restaurant_id: str):
  sample = {
    "res-1": [
      {"id":"m1","name":"Butter Chicken","price":299},
      {"id":"m2","name":"Paneer Tikka","price":199}
    ],
    "res-4": [
      {"id":"m7","name":"Masala Dosa","price":149},
      {"id":"m8","name":"Idly Sambar","price":99}
    ]
  }
  return jsonify({ "restaurantId": restaurant_id, "items": sample.get(restaurant_id, []) })

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=PORT)
