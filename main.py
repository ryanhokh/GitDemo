import yfinance as yf
import numpy as np
from scipy.optimize import minimize
from flask_cors import CORS

# define the stocks you want to include in the portfolio
stock_list = ["AAPL", "GOOG", "AMZN", "MSFT"]

# retrieve historical price data for the stocks
data = yf.download(stock_list, start="2019-01-01")

# calculate the daily returns
returns = data["Close"].pct_change()
returns = returns.fillna(0)

# function to calculate the historical drawdown
def historical_drawdown(weights):
    portfolio_returns = returns.dot(weights)
    running_max = np.maximum.accumulate(portfolio_returns + 1)
    drawdown = (portfolio_returns + 1) / running_max - 1
    return drawdown.min()

# define the optimization constraints
constraints = [{"type":"eq", "fun": lambda x: np.sum(x) - 1}, {"type":"ineq", "fun": lambda x: x}, {"type":"ineq", "fun": lambda x: -x+0.5}]

# minimize the historical drawdown
result = minimize(historical_drawdown, np.ones(len(stock_list)) / len(stock_list), constraints=constraints)

# print the optimal weights
print(result.x)




def drawdown_at_risk(returns, m, n):
    """
    Calculates drawdown-at-risk using block bootstrapping.
    :param returns: A numpy array of returns
    :param m: The block size
    :param n: The number of simulations
    :return: The drawdown-at-risk
    """
    N = len(returns)
    DR = np.zeros(n)
    for i in range(n):
        blocks = np.random.randint(0, N-m, size=(N//m, m))
        returns_bs = returns[blocks].flatten()
        cum_returns = (1+returns_bs).cumprod()
        running_max = np.maximum.accumulate(cum_returns)
        DD = cum_returns/running_max - 1
        DR[i] = np.min(DD)
    return np.percentile(DR, 5)


from statsmodels.graphics.tsaplots import plot_acf
returns = returns['AAPL']   # original series

m = 5       # block size
N = 250     # simulation TS length
n_iter = 100

import pandas as pd
simulated = pd.concat([returns[x:x+m]for x in np.random.randint(len(returns)-m, size = N // m)])


