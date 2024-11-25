import os

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from resources.cpm import CPM
from resources.chatgpt import Chatgpt
# from resources.weather import Weather

app = Flask(__name__)
api = Api(app)
CORS(app)

api.add_resource(CPM, '/cpm/<string:name>')
api.add_resource(Chatgpt, '/gpt/<string:pname>')
# api.add_resource(Weather, '/weather/<string:current_date>')

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # important to mention debug=True
