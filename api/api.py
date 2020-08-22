import time
from flask import Flask
from models.equity import Equity
import yfinance as yf

app = Flask(__name__)


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
    f = open("transformations.txt", "r")
    transformations = f.readline()

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


@app.route('/backtest', methods=['POST'])
def backtest():
    assert request.method == 'POST'
    json = request.get_json()
    test_start = json['startDate']
    test_end = json['endDate']
    transformations = json['transformations']

    values = []
    for transformation in transformations:
        eq = Equity(test_start, test_end)

    return {'name': 'Transformations', 'value': transformations}
