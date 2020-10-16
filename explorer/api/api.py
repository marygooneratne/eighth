import time
from flask import Flask
from DataUtil import DataUtil

app = Flask(__name__)
data_util = DataUtil()

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/data/<name>/<col>', methods=['GET'])
def get_data(name, col):
    return {"value": data_util.get_data(name, col)}

@app.route('/create/<category>/<name>', methods=['GET'])
def create_dataset(category, name):
    return {"value": data_util.create_dataset(category, name)}