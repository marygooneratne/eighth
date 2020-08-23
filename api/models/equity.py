import math
import numpy as np
import pandas as pd
import datetime
import yfinance as yf
from models.indicators import Indicators
from pandas_datareader import data as pdr


class Equity:

    def __init__(self, ticker, start_date, end_date, verbose=False):

        self.ticker = ticker
        self.start_date = start_date
        self.end_date = end_date
        self.pull_data(start_date, end_date, verbose)

        print(self.daily.head())
        temp = self.daily.loc[self.start_date:]
        self.start_index = len(temp)

        print(self.start_index)

    def run(self, transformation='close', args=[]):

        function = 'self.' + transformation + '(' + ','.join(args) + ')'
        return eval(function)

    def pull_data(self, start_date, end_date, verbose=False):

        yf.pdr_override()  # <== that's all it takes :-)
        adj_start_date = start_date - datetime.timedelta(days=100)
        # download dataframe
        self.daily = pdr.get_data_yahoo(
            self.ticker, start=str(adj_start_date), end=str(end_date))

    def close(self, verbose=False):

        closes = {}

        for index, row in self.daily[-1*(self.start_index):]['Close'].items():
            date = index.strftime("%Y-%m-%d")

            closes.update({date: [{'Close': row}]})
        return closes

    def open(self, verbose=False):

        opens = {}

        for index, row in self.daily[-1*(self.start_index):]['Open'].items():
            date = index.strftime("%Y-%m-%d")

            opens.update({date: [{'Open': row}]})
        return opens

    def high(self, verbose=False):

        highs = {}

        for index, row in self.daily[-1*(self.start_index):]['High'].items():
            date = index.strftime("%Y-%m-%d")

            highs.update({date: [{'High': row}]})
        return highs

    def low(self, verbose=False):

        lows = {}

        for index, row in self.daily[-1*(self.start_index):]['Low'].items():
            date = index.strftime("%Y-%m-%d")

            lows.update({date: [{'Low': row}]})
        return lows

    def get_price(self, date, type='c', verbose=False):
        if verbose:
            print(date)

        if type == 'o':
            if verbose:
                print("Getting Open", self.daily[date]['Open'])
            return self.daily[date]['Open']

        elif type == 'h':
            if verbose:
                print("Getting High", self.daily[date]['High'])
            return self.daily[date]['High']

        elif type == 'l':
            if verbose:
                print("Getting Low", self.daily[date]['Low'])

            return self.daily[date]['Low']

        else:
            if verbose:
                print("Getting Close", self.daily[date]['Close'])
            return self.daily[date]['Close']

    def ohlc(self, verbose=False):
        """The average of the open low high close

        Returns:
            [float[]] -- [A vector of the averages]
        """

        avg = (self.daily['Open'] + self.daily['High'] +
               self.daily['Low'] + self.daily['Close']) / 4

        avgs = {}
        for index, row in avg[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            avgs.update({date: [{'Open-High-Low-Close': row}]})

        return avgs

    def tp(self, verbose=False):
        """The 'Typical Prices' of the equity, or the average of the high,low, and close

        Returns:
            [float[]] -- [Vector of the averages]
        """
        tps = (self.daily['High'] + self.daily['Low'] +
               self.daily['Close']) / 3
        tp = {}
        for index, row in tps[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            tp.update({date: [{'Typical Prices': row}]})

        return tp

    def bop(self, verbose=False):
        """The balance of the power is a metric for
         determining the variability in the opens/closes versus
         highs/lows

        Returns:
            [float[]] -- [Vector of the index]
        """

        bop = (self.daily['Close'] - self.daily['Open']) / \
            (self.daily['High'] - self.daily['Low'])
        bops = {}
        for index, row in bop[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            avgs.update({date: [{'Balance of Power': row}]})

        return bops

    def bollinger(self, period=20, stds=2, verbose=False):
        """[The Bolinger Bands is essentially a confidence interval of 
        stds Deviations where the price should be based on the last 
        period periods of prices]

        Keyword Arguments:
            period {int} -- [The period over which to look over the 
            prices] (default: {20})
            stds {int} -- [The number of standard deviations the bands 
            should take up] (default: {2})

        Returns:
            [float[], float[]] -- [Upper Bolinger Band, Lower Bolinger Band vectors respectively]
        """
        tp = self.typical_prices()
        ma = Indicators.sma(prices=tp, period=period)
        std = Indicators.calc_std(prices=tp, period=period)

        bolu = np.array([ma[i] + stds * std[i] for i in range(len(ma))])
        bold = np.array([ma[i] + stds * std[i] for i in range(len(ma))])
        bols = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            bols.update({date: [{'Upper Bollinger': bolu[i - self.start_index]},
                                {'Lower Bollinger': bold[i - self.start_index]}]})
            i = i + 1
        return bols

    def asi(self, verbose=False):
        """[ASI is a way of looking at the prices of the equity
        in order to get information regarding momentum and market
        conditions]

        Returns:
            [float[]] -- [ASI values in a vector]
        """
        asi = np.zeros((len(self.daily['Close']),))
        for i in range(len(self.daily['Close'])):
            if i - 1 < 0:
                continue
            curr_close = self.daily['Close'][i]
            prev_close = self.daily['Close'][i - 1]
            curr_open = self.daily['Open'][i]
            prev_open = self.daily['Open'][i - 1]
            curr_high = self.daily['High'][i]
            prev_high = self.daily['High'][i - 1]
            curr_low = self.daily['Low'][i]
            prev_low = self.daily['Low'][i - 1]
            k = np.max([(prev_high - curr_close), (prev_low - curr_close)])
            t = curr_high - curr_low
            kt = k / t

            num = (prev_close - curr_close + (0.5 * (prev_close -
                                                     prev_open)) + (0.25 * (curr_close - curr_open)))

            r = Indicators.get_r(curr_high, curr_low, prev_close, prev_open)

            body = num / r

            asi[i] = 50 * body * kt
        asis = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            asis.update(
                {date: [{'Accumulative Swing Index': asi[i - self.start_index]}]})
            i = i + 1
        return asis

    def gopri(self, period=10, verbose=False):
        """The GOP looks at the largest swing in prices over the
        last period periods.

        Keyword Arguments:
            period {int} -- [Period over which to calculate GOP] 
            (default: {10})

        Returns:
            [float[]] -- [A vector of the GOP values]
        """
        gop = np.zeros((len(self.daily['Close']),))

        for i in range(len(self.daily['Close'])):
            if i - period < 0:
                continue
            highest = np.max(self.daily['High'][i:i-period])
            lowest = np.min(self.daily['Low'][i:i - period])
            price_range = highest - lowest
            gop[i] = math.log(price_range) / math.log(period)
        gops = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            gops.update({date: [{'GOP': gop[i - self.start_index]}]})
        return gops

    def pivots(self, verbose=False):
        """[Pivot poits are the centers of recent price movement]

        Returns:
            [float[],float[],float[],float[],float[]] -- [The pivot
            points, restiance one band, resistance 2 band, support 1
            band and support 2 band respectively as vectors.]
        """
        closes = self.daily['Close']
        highs = self.daily['High']
        lows = self.daily['Low']

        pivots = np.zeros((len(closes),))
        r1s = np.zeros((len(closes),))
        r2s = np.zeros((len(closes),))
        s1s = np.zeros((len(closes),))
        s2s = np.zeros((len(closes),))

        for i in range(len(closes)):
            pivot, r1, r2, s1, s2 = Indicators.calc_pivot_points(
                highs[i], lows[i], closes[i])
            pivots[i] = pivot
            r1s[i] = r1
            r2s[i] = r2
            s1s[i] = s1
            s2s[i] = s2
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            points.update({date: [{'Pivot Point': pivots[i - self.start_index]}, {'Resistance One': r1s[i - self.start_index]}, {
                          'Resistance Two': r2s[i - self.start_index]}, {'Support One': s1s[i - self.start_index]}, {'Support Two': s2s[i - self.start_index]}]})
            i = i + 1

        return points

    def pivot_ind(self, verbose=False):
        """[Gets the spread between closing prices and the pivot points
        for a given day]

        Returns:
            [float[]] -- [Vector of the differences]
        """
        pivots, *_ = self.pivot_points()

        ind = np.zeros((len(pivots),))
        for i in range(len(pivots)):
            ind[i] = self.daily['Close'][i] - pivots[i]
        points = {}

        i = 0
        for index, row in self.daily[-1*(self.start_index):].items():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Pivot Indicator': ind[i - self.start_index]}]})
            i = i+1
        return points

    def sma(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.sma(prices=prices, period=period)
        smas = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            smas.update(
                {date: [{'Simple Moving Average': ma[i - self.start_index]}]})
            i = i+1
        return smas

    def ema(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.ema(prices=prices, period=period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Exponential Moving Average': ma[i - self.start_index]}]})
            i = i + 1
        return points

    def wilder(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.ema(
            prices=prices, period=period, type='wilder')
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Wilder Moving Average': ma[i - self.start_index]}]})
            i = i + 1
        return points

    def macd(self, slow_period=18, fast_period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        macd = Indicators.macd(prices, slow_period, fast_period)

        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Moving Average Convergence Divergence': macd[i - self.start_index]}]})
            i = i + 1

        return points

    def moves(self, period=1, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        moves = Indicators.calc_moves(prices, period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update({date: [{'Move': moves[i - self.start_index]}]})
            i = i + 1
        return points

    def rsi(self, period=20, prices='c', type='ema', verbose=False):
        prices = self.convert_price_type(prices)
        rsi = Indicators.rsi(prices, period, type)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Relative Strength Index': rsi[i - self.start_index]}]})
            i = i + 1
        return points

    def up_down(self, period=1, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        up, down = Indicators.calc_up_down(prices, period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Up Move': up[i - self.start_index]}, {'Down Move': down[i-self.start_index]}]})
            i = i + 1
        return point

    def macd_ind(self, slow_period=18, fast_period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ind = Indicators.macd_indicator(prices, slow_period, fast_period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'MACD Indicator': ind[i - self.start_index]}]})
            i = i + 1
        return points

    def atr(self, period=10, verbose=False):
        true_ranges = np.zeros((len(self.daily['Close']),))
        for i, close in enumerate(self.daily['Close']):
            if i - 1 < 0:
                continue
            high = self.daily['High'][i]
            low = self.daily['Low'][i]
            cp = self.daily['Close'][i - 1]
            true_ranges[i] = np.max(
                [high - low, np.abs(high - cp), np.abs(low - cp)])
        avg_tr = Indicators.calc_average_true_range(true_ranges, period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Average True Range': avg_tr[i - self.start_index]}]})
            i = i + 1
        return points

    def kst(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        kst = Indicators.kst(prices)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Know Sure Thing': kst[i - self.start_index]}]})
            i = i + 1
        return points

    def kti(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        kst_ind = kst_trix_indicator(prices)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'KST Indicator': kst_ind[i - self.start_index]}]})
            i = i + 1
        return points

    def calc_std(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        stds = Indicators.calc_std(prices, period)
        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update({date: [{'Volatility': stds[i - self.start_index]}]})
            i = i + 1
        return points

    def trix(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        trix = Indicators.trix(prices)

        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update({date: [{'TRIX': trix[i - self.start_index]}]})
            i = i + 1
        return points

    def trix_ind(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        trix = Indicators.trix_indicator(prices)

        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'TRIX Indicator': trix[i - self.start_index]}]})
            i = i + 1
        return points

    def pkst(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        pkst = Indicators.prings_know_sure_thing(prices)

        points = {}
        i = 0
        for index, row in self.daily[-1*(self.start_index):].iterrows():
            date = index.strftime("%Y-%m-%d")

            points.update(
                {date: [{'Prings Know Sure Thing': pkst[i - self.start_index]}]})
            i = i + 1
        return points

    def convert_price_type(self, prices, verbose=False):
        if prices == 'c':
            prices = self.daily['Close']
        elif prices == 'o':
            prices = self.daily['Open']
        elif prices == 'h':
            prices = self.daily['High']
        else:
            prices = self.daily['Low']
        return prices

    def conv_date(self, date, verbose=False):
        ts = pd.Timestamp(date)

        return ts.to_pydatetime()
