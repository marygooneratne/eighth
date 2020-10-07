import matplotlib.pyplot as plt
from wrapper import get_data
import pandas as pd
import sys
import credentials
import psycopg2

if __name__ == "__main__":
    conn = psycopg2.connect(host="localhost",database="postgres", user=credentials.username, password=credentials.password, port=credentials.port)
    for idx in range(1, len(sys.argv)):
        
        ticker = sys.argv[idx]
        query = "SELECT * FROM Prices WHERE ticker = '{}' ORDER BY Date DESC"
        query = query.format(ticker)
        series = pd.read_sql(query, conn)
        series = series.set_index(['date'])['high']
        series.plot()
    
    plt.show()