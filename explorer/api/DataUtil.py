import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as dt
from datetime import datetime
from TwitterClient import TwitterClient
import csv
import os.path


class DataUtil:
    
    def __init__(self):
        self.twitter_client = TwitterClient(params={'oauth':True})
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
    
    def tweet_sentiment_analysis(self, name, col, to_csv=True):
        # try:
        
        df = pd.read_csv('data/'+name+'-raw.csv')
        tweets = df[col].tolist()
        analysis = self.twitter_client.analyze(tweets)
        df['polarity'] = analysis
        df['polarity'] = df['polarity'].apply(lambda x: x*10)
        df['date'] = pd.to_datetime(df['date']).dt.date
        srs = df.groupby(df.date)['polarity'].sum().sort_index()
        if to_csv: srs.to_csv('data/'+name+'-'+'tweets.csv')
        
        return srs
    
    def get_tweets_from_user(self, username, to_csv=True):
        tweets = self.twitter_client.fetch_by_user(username)
        print(len(tweets))
        with open('data/'+username+'-raw.csv','w+') as out:
            csv_out=csv.writer(out)
            csv_out.writerow(['date','tweet'])
            for row in tweets:
                csv_out.writerow(row)

    def create_dataset(self, category, name):
        try:
            self.get_tweets_from_user(name)
            self.tweet_sentiment_analysis(name, 'tweet')
            return True
        except:
            print('Failed to generate dataset')
            return False
    


    
    
    def get_data(self, name, col, json=True):
        full_name = name +"-"+ col
        if full_name not in self.gen:
            self.gen[full_name] = self.gen_series(name, col)
        if json:
            return self.gen[full_name].to_json()
        else:
            return self.gen[full_name]