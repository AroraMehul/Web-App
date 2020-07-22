import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import seaborn
import matplotlib.mlab as mlab

from scipy.stats import norm

import fix_yahoo_finance as yf

from tabulate import tabulate

def var(df)

	df = df[['Close']]
	df['returns'] = df.Close.pct_change()


	mean = np.mean(df['returns'])
	std_dev = np.std(df['returns'])

	df['returns'].hist(bins=40, density=True, histtype='stepfilled', alpha=0.5)
	x = np.linspace(mean - 3*std_dev, mean + 3*std_dev, 100)
	plt.plot(x, norm.pdf(x, mean, std_dev), 'r')
	plt.show()

	var_90 = norm.ppf(1-0.9, mean, std_dev)
	var_95 = norm.ppf(1-0.95, mean, std_dev)
	var_99 = norm.ppf(1-0.99, mean, std_dev)

	return s{"90%" = var_90, "95%" = var_95, "99%" = var_99}

