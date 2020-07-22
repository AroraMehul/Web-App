import pandas as pd

data = pd.read_csv('loan.csv', low_memory=False)

print(data.columns)
print()
print(data.iloc[0])