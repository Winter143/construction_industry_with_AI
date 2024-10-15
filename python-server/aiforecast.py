import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

from datetime import datetime
from prophet import Prophet
from prophet.plot import plot_plotly

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

    print(new_chunk)

    # list to dataframe
    list_to_df = pd.DataFrame(new_chunk, columns=['month', 'year', 'y', 'humid', 'weather status', 'ds'])
    
    # instantiate the model
    model = Prophet()
    model.fit(list_to_df)

    # prediction using fitted model
    forecast_pred=model.make_future_dataframe(periods=1825)
    pred=model.predict(forecast_pred)
    # plot_plotly(model,pred)

    pred.to_csv('data/prediction.csv')
    
    # Prophet's plot method creates a prediction graph
    fig = model.plot(pred)

    # display prediction graph
    plt.xlabel("Date")
    plt.ylabel("Temperature")
    # plt.show()
    plt.savefig('images/plot.png')
    