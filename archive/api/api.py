import time
from flask import Flask
from flask import request
from models.equity import Equity
import yfinance as yf
import datetime as dt

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/equities', methods=['GET'])
def get_equities():
    f = open("us-stocks.txt", "r")
    stocks = f.readline()

    return {'name': 'Tickers', 'value': stocks}


@app.route('/transformations', methods=['GET'])
def get_transformations():
    transformations = {}
    with open("transformations.txt", "r") as f:
        for line in f:
            stripped_line = line.strip().split(':')
            transformations.update({stripped_line[0]: stripped_line[1]})

    return {'name': 'Transformations', 'value': transformations}

# Example Request
# {'startDate':'01-01-2020',
# 'endDate':'02-01-2020',
# 'transformations':
#   [{'ticker':'AAPL','transformation':'Close'},{'ticker':'AAPL','transformation':'Pivot Points'}]}
# Example Response
# {'name': 'Transformations',
#       'value': [{'ticker': 'AAPL',
#                   'transformation': 'Close',
#                   'values':[{'date':'01-01-2020',
#                           'values':[{'Close': 345.45}]},
#                               {'date':'01-02-2020',
#                               'values':[{'Close': 325.45}]}]},
#                   {'ticker': 'AAPL',
#                   'transformation': 'Pivot Points',
#                   'values':[{'date':'01-01-2020',
#                           'values':[{'Pivot': 345.45},
#                                     {'Resistance 1': 346.71},
#                                     {'Resistance 2': 348.71},
#                                     {'Support 1': 343.71}]},
#                                     {'Support 2': 341.71}
#                               {'date':'01-02-2020',
#                               'values':[{'Pivot': 345.45},
#                                     {'Resistance 1': 346.71},
#                                     {'Resistance 2': 348.71},
#                                     {'Support 1': 343.71}]},
#                                     {'Support 2': 341.71}
#                           }]}]}


@app.route('/explore', methods=['POST'])
def backtest():

    assert request.method == 'POST'

    json = request.get_json(force=True)
    print(json)
    start = json['startDate'].split('-')
    end = json['endDate'].split('-')
    test_start = dt.date(int(start[0]), int(start[1]), int(start[2]))
    test_end = dt.date(int(end[0]), int(end[1]), int(end[2]))
    transformations = json['transformations']

    values = []
    for transformation in transformations:
        eq = Equity(transformation['ticker'], test_start, test_end)
        values.append(eq.run(transformation['transformation']))
    print(values)
    return {'name': 'Transformations', 'value': values}
