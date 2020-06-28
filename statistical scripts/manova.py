import pandas as pd
from statsmodels.multivariate.manova import MANOVA

#url = 'https://vincentarelbundock.github.io/Rdatasets/csv/datasets/iris.csv'
url = '/content/datasets_9109_12699_german_credit_data.csv'
df = pd.read_csv(url, index_col=0)
df.columns = df.columns.str.replace(" ", "_")
df.head()

maov = MANOVA.from_formula('Age + Sex + \
                            Job + Housing + Saving_accounts + Checking_account + Credit_amount + Duration + Purpose ~ Risk', data=df)

print(maov.mv_test())

