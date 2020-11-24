import numpy as np


class Indicator:

    def __init__(self, values, verbose=False):
        self.values = values
        self.len = len(values)

    def trim_vals(self, start_index=0, end_index=-1):
        self.values = self.values[start_index:end_index]
        self.len = len(self.values)

        return self

    def plot(self, ax, line_style, range=-1):
        i = np.arange(len(self.values[:range]))
        ax.plot(i, np.flip(self.values[:range]), line_style)

        return ax

    def get_deltas(self):
        self.values = self.delta_values()
        self.len = len(self.values)
        return self

    def delta_values(self):
        values = []
        for i, value in enumerate(self.values):
            if(i+1 >= len(self.values)):
                continue
            values.append((self.values[i+1]-value)/value)

        return values
