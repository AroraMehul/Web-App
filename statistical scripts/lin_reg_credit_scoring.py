import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder 
from sklearn import preprocessing
import pandas as pd
from sklearn.utils import shuffle

data = pd.read_csv('/content/datasets_9109_12699_german_credit_data.csv')

def linear_regression(data, input_row):
    data.columns = data.columns.str.replace(" ", "_")

    data = data.dropna()

    categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']
    le = LabelEncoder()
    for val in categorical:
      data[val] = le.fit_transform(data[val])

    data = data.drop(columns='Unnamed:_0')
    for col in data.columns:
      if(col not in categorical):
        data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])
    data.head()

    shuffle(data)
    split = 0.7
    split_idx = int(len(data)*split)
    data_train = data[:split_idx]
    data_test = data[split_idx:]

    y_train = data_train['Risk']
    x_train = data_train.loc[:, data_train.columns != 'Risk']
    y_test = data_test['Risk']
    x_test = data_test.loc[:, data_test.columns != 'Risk']

    reg = LinearRegression().fit(x_train, y_train)

    predictions = reg.predict(input_row)

    return predictions*100

