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
        # Make mask of all days after start_date and take len to find where to start to trim all return vals

        print(self.daily.head())
        temp = self.daily.loc[self.start_date:]
        self.start_index = len(temp)

        print(self.start_index)

    def pull_data(self, start_date, end_date, verbose=False):

        yf.pdr_override()  # <== that's all it takes :-)
        adj_start_date = start_date - datetime.timedelta(days=100)
        # download dataframe
        self.daily = pdr.get_data_yahoo(
            self.ticker, start=str(adj_start_date), end=str(end_date))

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

        return avg[-1*(self.start_index):]

    def typical_prices(self, verbose=False):
        """The 'Typical Prices' of the equity, or the average of the high,low, and close

        Returns:
            [float[]] -- [Vector of the averages]
        """
        tps = (self.daily['High'] + self.daily['Low'] +
               self.daily['Close']) / 3

        return tps[-1*(self.start_index):]

    def balance_of_power(self, verbose=False):
        """The balance of the power is a metric for
         determining the variability in the opens/closes versus
         highs/lows

        Returns:
            [float[]] -- [Vector of the index]
        """

        bop = (self.daily['Close'] - self.daily['Open']) / \
            (self.daily['High'] - self.daily['Low'])

        return bop[-1*(self.start_index):]

    def bollinger_bands(self, period=20, stds=2, verbose=False):
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

        return bolu[-1*(self.start_index):], bold[-1*(self.start_index):]

    def accumulative_swing_index(self, verbose=False):
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
        return asi[-1*(self.start_index):]

    def gop_range_index(self, period=10, verbose=False):
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

        return gop[-1*(self.start_index):]

    def pivot_points(self, verbose=False):
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

        return pivots[-1*(self.start_index):], r1s[-1*(self.start_index):], r2s[-1*(self.start_index):], s1s[-1*(self.start_index):], s2s[-1*(self.start_index):]

    def pivot_indicator(self, verbose=False):
        """[Gets the spread between closing prices and the pivot points
        for a given day]

        Returns:
            [float[]] -- [Vector of the differences]
        """
        pivots, *_ = self.pivot_points()

        ind = np.zeros((len(pivots),))
        for i in range(len(pivots)):
            ind[i] = self.closes[i] - pivots[i]

        return ind[-1*(self.start_index):]

    def sma(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.sma(prices=prices, period=period)
        return ma[:-1*(self.start_index)]

    def ema(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.ema(prices=prices, period=period)
        return ma[-1*(self.start_index):]

    def wilder(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ma = Indicators.ema(
            prices=prices, period=period, type='wilder')
        return ma[-1*(self.start_index):]

    def macd(self, slow_period=18, fast_period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        macd = Indicators.macd(prices, slow_period, fast_period)
        return macd[-1*(self.start_index):]

    def calc_moves(self, period=1, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        moves = Indicators.calc_moves(prices, period)
        return moves[-1*(self.start_index):]

    def rsi(self, period=20, prices='c', type='ema', verbose=False):
        prices = self.convert_price_type(prices)
        rsi = Indicators.rsi(prices, period, type)
        return rsi[-1*(self.start_index):]

    def up_down(self, period=1, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        up_down = Indicators.calc_up_down(prices, period)
        return up_down[-1*(self.start_index):]

    def macd_indicator(self, slow_period=18, fast_period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        ind = Indicators.macd_indicator(prices, slow_period, fast_period)
        return ind[-1*(self.start_index):]

    def average_true_range(self, period=10, verbose=False):
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
        return avg_tr[-1*(self.start_index):]

    def kst(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        kst = Indicators.kst(prices)
        return kst[-1*(self.start_index):]

    def kst_trix_indicator(self, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        kst_ind = kst_trix_indicator(prices)
        return kst_ind[-1*(self.start_index):]

    def calc_std(self, period=9, prices='c', verbose=False):
        prices = self.convert_price_type(prices)
        stds = Indicators.calc_std(prices, period)
        return stds[-1*(self.start_index):]

    def trix(self, prices, verbose=False):
        prices = self.convert_price_type(prices)
        trix = Indicators.trix(prices)

        return trix[-1*(self.start_index):]

    def trix_indicator(self, prices, verbose=False):
        prices = self.convert_price_type(prices)
        trix = Indicators.trix_indicator(prices)

        return trix[-1*(self.start_index):]

    def prings_know_sure_thing(self, prices, verbose=False):
        prices = self.convert_price_type(prices)
        pkst = Indicators.prings_know_sure_thing(prices)

        return pkst[-1*(self.start_index):]

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
