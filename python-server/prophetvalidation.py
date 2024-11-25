from prophet.diagnostics import cross_validation
from prophet.diagnostics import performance_metrics
from prophet.plot import plot_cross_validation_metric
from prophet import Prophet

import pandas as pd
import numpy as np
import csv
from datetime import datetime

def transform_csv():
    # read csv
    df = pd.read_csv("aidata.csv")

    # combine month, day and year columns
    df['date'] = df[df.columns[:3]].apply(lambda x: '-'.join(x.dropna().astype(str)),axis=1)
    df["date"] = pd.to_datetime(df.date).dt.strftime('%Y-%m-%d')

    # remove the celsius unit in string to calculate the mean value
    df["TEMPERATURE"] = df["TEMPERATURE"].str.replace('°C', '')

    return df

def drop_columns(data):
    df = data.drop(columns=['DAY', 'HOUR'])

    return df

def split_list(new_list):
    chunks = []
    chunk_size = 5
    for i in range(0, len(new_list), chunk_size):
        chunk = new_list[i:i + chunk_size]
        chunks.append(chunk)

    return chunks

def clean_list(chunks):
    new_chunk = []
    for chunk in chunks:
        new_temp = get_combined_values(chunk)
        for c in chunk:
            c[2] = new_temp
        new_chunk.append(chunk[0])
    
    return new_chunk

# combine values and get the mean value
def get_combined_values(chunk):
    new_temp = 0
    for l in chunk:
        if "C" in l[2]:
            l[2] = l[2].replace("C", "")
        if l[2] == "" or l[2] == " ":
            continue
        conv_to_int = int(l[2])
        new_temp += conv_to_int

    mean = new_temp / 5

    return mean

if __name__=="__main__": 
    df = transform_csv()
    data=df.rename(columns={"date":"ds","TEMPERATURE":"y"})

    # dataframe to list
    new_list = drop_columns(data).values.tolist()

    # split list into chunks
    chunks = split_list(new_list)
    new_chunk = clean_list(chunks)

    # list to dataframe
    list_to_df = pd.DataFrame(new_chunk, columns=['month', 'year', 'y', 'humid', 'weather status', 'ds'])
    
    # instantiate the model
    model = Prophet()
    model.fit(list_to_df)
    
    # cross validate to check efficiency
    # horizon - how frequent you want to predict (5 years == 1826 days)
    # period - making predictions every year (period == 365 days)
    # initial - should be twice or equal to the value of horizon
    df_cv = cross_validation(model, initial='1826 days', period='365 days', horizon='1825 days')
    df_p = performance_metrics(df_cv)

    # save to csv the trained data
    filename = "prophetvalidation.csv"
    df_p.to_csv(filename)
    
    # read csv
    df = pd.read_csv(filename, usecols=['horizon', 'smape'])
    df = df.rename(columns={'horizon': 'Day', 'smape' : 'Percentage'})

    days_list = df['Day'].tolist()
    percentage_list = df['Percentage'].tolist()

    for d, p in zip(days_list, percentage_list):
        if "365" in d:
            day = d.replace("days", "").strip()
            per = 100 - (float(p) * 100)
            print("Day: {} --> {}%".format(day, per))
        if "730" in d:
            day = d.replace("days", "").strip()
            per = 100 - (float(p) * 100)
            print("Day: {} --> {}%".format(day, per))
        if "1095" in d:
            day = d.replace("days", "").strip()
            per = 100 - (float(p) * 100)
            print("Day: {} --> {}%".format(day, per))
        if "1460" in d:
            day = d.replace("days", "").strip()
            per =  100 - (float(p) * 100)
            print("Day: {} --> {}%".format(day, per))
        if "1825" in d:
            day = d.replace("days", "").strip()
            per = 100 - (float(p) * 100)
            print("Day: {} --> {}%".format(day, per))

