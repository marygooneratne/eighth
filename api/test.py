from models.equity import Equity
import datetime as dt
eq = Equity('AAPL', dt.date(2020, 1, 1), dt.date(2020, 2, 1))

print(eq.run('pkst', ['\'o\'']))
