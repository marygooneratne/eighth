import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as dt
from datetime import datetime


def scale(val, rmin, rmax, tmin, tmax):
    return ((val-rmin)/(rmax-rmin))*(tmax-tmin)+tmin

trump_df = pd.read_csv('approvals.csv')
trump_df['enddate'] = pd.to_datetime(trump_df.enddate)
trump_srs = trump_df.groupby('enddate')['adjusted_approve'].mean().sort_index()

trump_dates = [dt.date2num(date) for date in trump_srs.keys()]
org_max = max(trump_srs.values)
org_min = min(trump_srs.values)
trump_vals = [val - min(trump_srs.values) for val in trump_srs.values]
trump_vals = [val/max(trump_srs.values) for val in trump_srs.values]

sp_df = pd.read_csv('sp.csv')
sp_df['Date'] = pd.to_datetime(sp_df.Date)
sp_srs = sp_df.groupby('Date')['High'].mean().sort_index()

sp_dates = [dt.date2num(date) for date in sp_srs.keys()]
sp_highs = [scale(val, min(sp_srs.values), max(sp_srs.values), org_min, org_max) for val in sp_srs.values]
print(sp_highs)
sp_vals = [val - min(sp_highs) for val in sp_highs]
sp_vals = [val/max(sp_vals) for val in sp_vals]

diff_dates = []
diff = []
for idx, date in enumerate(sp_dates):
    if date in trump_dates: 
        diff.append(sp_vals[idx] - trump_vals[trump_dates.index(date)])
        diff_dates.append(date)

plt.plot_date(trump_dates, trump_vals, fmt='-r')
plt.plot_date(sp_dates, sp_vals, fmt='-g')
plt.plot_date(diff_dates, diff, fmt='--b')

plt.show()

