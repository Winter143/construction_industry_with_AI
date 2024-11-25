import re
from datetime import datetime, timedelta
import os

class WeatherRunner:
    def __init__(self, current_date):
        self.current_date = current_date
        
    def get_days(self): 
        current_date = datetime.now()
        current_date = current_date.strftime('%Y-%m-%d')
        if self.current_date.upper() != 'TODAY':
            current_date = self.current_date
        presentday = datetime.strptime(current_date, '%Y-%m-%d').date()
        yesterday = presentday - timedelta(1)
        tomorrow = presentday + timedelta(1)

        pday = presentday.strftime('%Y-%m-%d')
        yday = yesterday.strftime('%Y-%m-%d')
        tomday = tomorrow.strftime('%Y-%m-%d')

        return pday, yday, tomday

    def process_csv(self):
        input_data = open(os.getcwd() + '/data/prediction.csv', 'r')
        pday, yday, tomday = self.get_days()
        new_csv = []
        for row in input_data:
            if not re.match('trend', row):
                split_row = row.rstrip('\n').split(',')
                if split_row[1] == pday:
                    today = row
                    new_csv.append(today)
                
        return new_csv

    def determine_weather(self, temp, humid):
        if int(float(temp)) >= 22 and int(float(temp)) <= 27 and humid == "0.0":
            weather = "Partly Cloudy"
        elif int(float(temp)) >= 23 and int(float(temp)) <= 26 and int(float(humid)) >= 0.0 and int(float(humid)) <= 0.3:
            weather = "Patchy rain possible"
        elif int(float(temp)) >= 23 and int(float(temp)) <= 26 and int(float(humid)) >= 0.4 and int(float(humid)) <= 0.7:
            weather = "Moderate rain at times"
        elif int(float(temp)) >= 23 and int(float(temp)) <= 26 and int(float(humid)) >= 0.8 and int(float(humid)) <= 3.0:
            weather = "Clear"
        elif int(float(temp)) >= 25 and int(float(temp)) <= 29 and int(float(humid)) >= 1.0 and int(float(humid)) <= 1.5:
            weather = "Heavy rain at times"
        elif int(float(temp)) >= 26 and int(float(temp)) <= 35 and int(float(humid)) >= 2.0 and int(float(humid)) <= 5.0:
            weather = "Moderate or heavy rain shower"
        else:
            weather = "Cloudy"
        
        return weather

    def process_weather_data(self):
        new_csv = self.process_csv()
        new_data = []
        for new in new_csv:
            split_fields = new.split(",")
            data = {
                "date": split_fields[1],
                "six_am": split_fields[2],
                "six_am_humid": split_fields[10].replace("-", "")[:3],
                "six_am_status": self.determine_weather(split_fields[2], split_fields[10].replace("-", "")[:3]),
                "nine_am": split_fields[3],
                "nine_am_humid": split_fields[11].replace("-", "")[:3],
                "nine_am_status": self.determine_weather(split_fields[3], split_fields[11].replace("-", "")[:3]),
                "twelve_pm": split_fields[4],
                "twelve_pm_humid": split_fields[12].replace("-", "")[:3],
                "twelve_pm_status": self.determine_weather(split_fields[4], split_fields[12].replace("-", "")[:3]),
                "three_pm": split_fields[5],
                "three_pm_humid": split_fields[13].replace("-", "")[:3],
                "three_pm_status": self.determine_weather(split_fields[5], split_fields[13].replace("-", "")[:3]),
                "six_pm": split_fields[6],
                "six_pm_humid": split_fields[14].replace("-", "")[:3],
                "six_pm_status": self.determine_weather(split_fields[6], split_fields[14].replace("-", "")[:3]),
            }
            new_data.append(data)
        
        return new_data

if __name__=="__main__": 
    weatherrunner = WeatherRunner()
    new_data = weatherrunner.process_weather_data()
    print(new_data)