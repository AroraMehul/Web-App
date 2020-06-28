import json
import numpy as np
import pandas as pd
import requests
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder 
from sklearn import preprocessing
from sklearn.utils import shuffle
from scipy.stats import norm
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline 

def var(df, scorecolor):

	print("Entered var")

	URL = str(df['link'][0])
	r = requests.get(URL, params=None)
	data_json = r.json()
	df = json.loads(data_json)
	df = pd.DataFrame(df)

	df = df[['Close']]
	df['returns'] = df.Close.pct_change()

	mean = np.mean(df['returns'])
	std_dev = np.std(df['returns'])
	var_90 = norm.ppf(1-0.9, mean, std_dev)
	var_95 = norm.ppf(1-0.95, mean, std_dev)
	var_99 = norm.ppf(1-0.99, mean, std_dev)

	for criteria in scorecolor:
		mini, maxi = criteria.split("-")
		if(abs(var_95)*100 > float(mini) and abs(var_95)*100 < float(maxi)):
			return var_95, scorecolor[criteria]

	

	return "default", "Green"

def linear_regression(input_row, scorecolor):

	print("Enetered Linear Regression")
	
	# URL = ""
	# r = requests.get(URL, params=None)
	# data_json = r.json()
	# data = json.load(data_json)
	data = pd.read_csv("/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv")

	data.columns = data.columns.str.replace(" ", "_")

	data = data.dropna()

	data.append(input_row, sort = False)

	categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])

	data = data.drop(columns='Unnamed:_0')
	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	split = 0.7
	split_idx = int(len(data)*split)
	data_train = data[:split_idx]
	data_test = data[split_idx:]

	y_train = data_train['Risk']
	x_train = data_train.loc[:, data_train.columns != 'Risk']
	y_test = data_test['Risk']
	x_test = data_test.loc[:, data_test.columns != 'Risk']

	reg = LinearRegression().fit(x_train, y_train)

	predictions = reg.predict(x_test)
	for i in range(len(predictions)):
		if predictions[i] > 0.5:
			predictions[i] = 1
		else:
			predictions[i] = 0

	count = 0
	y_test = np.array(y_test)
	for i in range(len(predictions)):
		if(y_test[i] == predictions[i]):
			count = count + 1
	accuracy = count/len(predictions)

	for criteria in scorecolor:
		mini, maxi = criteria.split("-")
		if(accuracy*100 > int(mini) and accuracy*100 < int(maxi)):
			if(predictions[len(x_test)-1] < 0.5):
				color = "red"
			else:
				color = "green"
			return color, scorecolor[criteria]

	return "Green"

def polynomial_regression(input_row, scorecolor):

	print("Enetered Polynomial Regression")
	
	# URL = ""
	# r = requests.get(URL, params=None)
	# data_json = r.json()
	# data = json.load(data_json)
	data = pd.read_csv("/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv")

	data.columns = data.columns.str.replace(" ", "_")

	data = data.dropna()

	data.append(input_row, sort = False)

	categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])

	data = data.drop(columns='Unnamed:_0')
	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	split = 0.7
	split_idx = int(len(data)*split)
	data_train = data[:split_idx]
	data_test = data[split_idx:]

	y_train = data_train['Risk']
	x_train = data_train.loc[:, data_train.columns != 'Risk']
	y_test = data_test['Risk']
	x_test = data_test.loc[:, data_test.columns != 'Risk']

	model = Pipeline([('poly', PolynomialFeatures(degree=2)),('linear', LinearRegression(fit_intercept=False))])
	reg = model.fit(x_train, y_train)

	#reg = LinearRegression().fit(x_train, y_train)

	predictions = reg.predict(x_test)
	for i in range(len(predictions)):
		if predictions[i] > 0.5:
			predictions[i] = 1
		else:
			predictions[i] = 0

	count = 0
	y_test = np.array(y_test)
	for i in range(len(predictions)):
		if(y_test[i] == predictions[i]):
			count = count + 1
	accuracy = count/len(predictions)

	print(accuracy)
	for criteria in scorecolor:
		mini, maxi = criteria.split("-")
		if(accuracy*100 > int(mini) and accuracy*100 < int(maxi)):
			if(predictions[len(x_test)-1] < 0.5):
				color = "red"
			else:
				color = "green"
			return color, scorecolor[criteria]

	return "Green"

def manova(data, scorecolor):
	url = '/content/datasets_9109_12699_german_credit_data.csv'
	data = pd.read_csv(url, index_col=0)
	data.columns = data.columns.str.replace(" ", "_")

	data.columns = data.columns.str.replace(" ", "_")
	data = data.dropna()

	categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])


	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	x = data.loc[:, data.columns != 'Risk']
	y = data['Risk']

	manova = MANOVA(endog=x, exog=y)

	print(manova.mv_test())

	output = manova.mv_test()

	out = np.array(output['x0']['stat'])

	WL = out[0][0]
	PT = out[1][0]
	HT = out[2][0]
	RGR = out[3][0]

	for criteria in scorecolor:
		mini, maxi = criteria.split("-")
		if(WL > int(mini) and WL < int(maxi)):
			return WL, scorecolor[criteria]

	WL, PT, HT, RGR


def stat_score(loan_id, details):
	print("Entered stat_score")
	loan_details = details[str(loan_id)]
	data = pd.DataFrame(loan_details['values'], index=[0])
	scorecolor = loan_details['color']
	if(loan_details['Type'] == 'VaR'):
		print("VaR Selected")
		output = var(data, scorecolor)
	elif(loan_details['Type'] == 'MANOVA'):
		print("MANOVA Selected")
		output = manova(data, scorecolor)
	elif(loan_details['Type'] == 'LinReg'):
		print("Linear Regression Selected")
		output = linear_regression(data, scorecolor)
	elif(loan_details['Type'] == 'PolyReg'):
		print("Polynomial Regression Selected")
		output = polynomial_regression(data, scorecolor)

	print(output)


print("Enter Loan Id")
loan_id = int(input())
URL = "https://raw.githubusercontent.com/humbletechy/Assign/master/statistical.json"
r = requests.get(URL, params=None)
details = r.json()
stat_score(loan_id, details)


