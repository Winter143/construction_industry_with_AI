from flask_restful import Resource, reqparse
from .weatherrunner import WeatherRunner


class Weather(Resource):
    def get(self, current_date):
        weatherrunner = WeatherRunner(current_date)
        new_data = weatherrunner.process_weather_data()
        return {'message': 'success', 'data': new_data}, 200

