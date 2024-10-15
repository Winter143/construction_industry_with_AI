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
        temp = float(temp)
        humid = float(humid)
        
        if 30 <= temp <= 32 and humid == 0.0:
            weather = "Clear"
        elif 29 <= temp <= 30 and 0.0 <= humid <= 0.3:
            weather = "Cloudy"
        elif 27 <= temp < 29 and 0.0 <= humid <= 0.5:
            weather = "Patchy rain possible"
        elif 25 <= temp < 27 and 0.0 <= humid <= 0.5:
            weather = "Moderate rain at times"
        elif 24 <= temp < 26 and 0.0 <= humid <= 1.0:
            weather = "Heavy rain at times"
        elif 20 <= temp < 26 and 1.0 <= humid <= 3.0:
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