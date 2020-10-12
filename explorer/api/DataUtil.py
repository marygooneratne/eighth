import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as dt
from datetime import datetime

class DataUtil:
    
    def __init__(self):
        self.gen = {}
    
    def gen_series(self, name, col):
        print("THE COLUMN", col)
        try:
            df = pd.read_csv('data/' + name + '.csv')
            df['date'] = pd.to_datetime(df.date)
            srs = df.groupby(df.date)[col].mean().sort_index()
            print(srs)
            print('HELLO')
            return srs
        except Exception as e:
            print('Unable to generate pd.Series: ', e)
            return None
    
    
    def get_data(self, name, col, json=True):
        full_name = name +"-"+ col
        if full_name not in self.gen:
            self.gen[full_name] = self.gen_series(name, col)
        if json:
            return self.gen[full_name].to_json()
        else:
            return self.gen[full_name]