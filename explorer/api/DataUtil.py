import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as dt
from datetime import datetime

class DataUtil:
    
    def __init__(self):
        self.gen = {}
    
    def gen_series(self, name, col):
        try:
            df = pd.read_csv('data/' + name + '.csv')
            df['date'] = pd.to_datetime(df.date)
            srs = df.groupby(df.date)[col].mean().sort_index()

            return srs
        except Exception as e:
            print('Unable to generate pd.Series: ', e)
            return None
    
    
    def get_data(self, name, col, json=True):
        if name not in self.gen:
            self.gen[name] = self.gen_series(name, col)
        if json:
            return self.gen[name].to_json()
        else:
            return self.gen[name]