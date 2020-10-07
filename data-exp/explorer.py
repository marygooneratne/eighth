import sys
import requests
import datetime as dt
import time as t

BASE = 'https://finnhub.io/api/v1/'
TOKEN = 'bth91hf48v6v983bkpj0'

def dataset(ticker, value, start_date, end_date):
    from_time = str(int(t.mktime(dt.datetime.strptime(start_date, "%m/%d/%Y").utctimetuple())))
    to_time = str(int(t.mktime(dt.datetime.strptime(end_date, "%m/%d/%Y").utctimetuple())))
    url = BASE + '/stock/candle?symbol=' + ticker + '&resolution=D&from='  + from_time + '&to='+ to_time+'&token='+TOKEN
    # url = 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1572651390&to=1572910590&token='+TOKEN
    print(url)
    r = requests.get(url)
    print(r.json())

def explore(sets, start_date='02/01/2016', end_date='09/15/2018'):
    colors = ['r', 'g', 'b', 'k', 'y', 'p']
    for ticker, value in sets:
        dataset(ticker, value, start_date, end_date)
        # dates, values = dataset(ticker, value, start_date, end_date)
        # plt.plot_date(trump_dates, trump_vals, fmt='-r')

if __name__ == '__main__':
    sets = [(sys.argv[i], sys.argv[i+1]) for i in range(1, len(sys.argv)-1)]
    explore(sets)



1572910590
1572651390
1546318800