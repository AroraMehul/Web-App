import json
import numpy as np
import pandas as pd
import requests
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from scipy.stats import norm
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline 
from statsmodels.multivariate.manova import MANOVA
import configparser
import csv

def var(df):

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
			#return var_95, scorecolor[criteria]
			return {"method" : "VaR", "Risk" : var_95, "color" : scorecolor[criteria]}

	

	return {"method" : "VaR", "Risk" : "Default", "color" : "Green"}

def linear_regression(input_row, data, categorical):

	print("Enetered Linear Regression")

	data = data.dropna()
	data.loc[len(data)] = input_row
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])
	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	split = 0.8
	split_idx = int(len(data)*split)
	data_train = data[:split_idx]
	data_test = data[split_idx:]

	y_train = data_train[10]
	x_train = data_train.loc[:, data_train.columns != 10]
	y_test = data_test[10]
	x_test = data_test.loc[:, data_test.columns != 10]

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
	print(accuracy)

	if(predictions[len(x_test)-1] < 0.5):
		color = "red"
	else:
		color = "green"
	
	return {"method" : "LinReg", "color" : color, "prediction" : 100*accuracy}

def polynomial_regression(input_row, data, categorical):

	print("Enetered Polynomial Regression")

	data = data.dropna()
	data.loc[len(data)] = input_row
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])

	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	split = 0.7
	split_idx = int(len(data)*split)
	data_train = data[:split_idx]
	data_test = data[split_idx:]

	y_train = data_train[10]
	x_train = data_train.loc[:, data_train.columns != 10]
	y_test = data_test[10]
	x_test = data_test.loc[:, data_test.columns != 10]

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
	
	if(predictions[len(x_test)-1] < 0.5):
		color = "red"
	else:
		color = "green"
	
	return {"method" : "PolyReg", "color" : color, "prediction" : 100*accuracy}

def manova(test_row, data, categorical):

	data = data.dropna()
	data.loc[len(data)] = test_row

	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])


	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col] - np.mean(data[col]))/np.std(data[col])

	test_row = data.iloc[len(data)-1]
	data.drop([len(data)-1])

	data_good = data[data[10] == 0]
	data_bad = data[data[10] == 1]

	x_good = data_good.drop([10, 9], axis = 1)
	y_good = data_good[[9]]
	x_bad = data_bad.drop([10, 9], axis = 1)
	y_bad = data_bad[[9]]

	man_good = MANOVA(endog=x_good, exog=y_good)
	man_bad = MANOVA(endog=x_bad, exog=y_bad)

	output_good = man_good.mv_test()
	output_bad = man_bad.mv_test()

	out_good = np.array(output_good['x0']['stat'])
	out_bad = np.array(output_bad['x0']['stat'])

	WL_good = out_good[0][0]
	PT_good = out_good[1][0]
	HT_good = out_good[2][0]
	RGR_good = out_good[3][0]

	WL_bad = out_bad[0][0]
	PT_bad = out_bad[1][0]
	HT_bad = out_bad[2][0]
	RGR_bad = out_bad[3][0]

	x = test_row.drop([10, 9])
	y = test_row[[9]]

	data_test_x = x_good.append(x)
	data_test_y = y_good.append(y)

	man_test = MANOVA(endog=data_test_x, exog=data_test_y)
	output_test = man_test.mv_test()

	out_test = np.array(output_test['x0']['stat'])

	WL_test_good = out_test[0][0]
	PT_test_good = out_test[1][0]
	HT_test_good = out_test[2][0]
	RGR_test_good = out_test[3][0]

	data_test_x = x_bad.append(x)
	data_test_y = y_bad.append(y)

	man_test = MANOVA(endog=data_test_x, exog=data_test_y)
	output_test = man_test.mv_test()

	out_test = np.array(output_test['x0']['stat'])

	WL_test_bad = out_test[0][0]
	PT_test_bad = out_test[1][0]
	HT_test_bad = out_test[2][0]
	RGR_test_bad = out_test[3][0]

	scorecard = {"method" : "MANOVA", "WL_good" : WL_good, "WL_test_good" : WL_test_good, "WL_bad" : WL_bad, "WL_test_bad" : WL_test_bad}

	ret = "WL good : " + str(WL_good) + " WL test good : " + str(WL_test_good) + "\nWL bad : " + str(WL_bad) + " WL test bad : " + str(WL_test_bad)

	return scorecard


def stat_score(loan_id, model_type):
	print(model_type)
	config = configparser.ConfigParser()
	config.read('config.ini')
	req = requests.get(config['dataset']['location'], params=None)
	dec = req.content.decode('utf-8')
	csv_reader = csv.reader(dec.splitlines(), delimiter=',')
	csv_reader = list(csv_reader)
	df = pd.DataFrame(csv_reader, columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
	data = df.drop(0)
	cols = data.columns
	num_cols = data._get_numeric_data().columns
	categorical = list(set(cols) - set(num_cols))
	print("Entered stat_score")
	try :
		input_row = data.iloc[int(loan_id)]
		if(model_type == 'var'):
			print("VaR Selected")
			#output = var(data, scorecolor)
		elif(model_type == 'manova'):
			print("MANOVA Selected")
			output = manova(input_row, data, categorical)
		elif(model_type == 'lin_reg'):
			print("Linear Regression Selected")
			output = linear_regression(input_row, data, categorical)
		elif(model_type == 'poly_reg'):
			print("Polynomial Regression Selected")
			output = polynomial_regression(input_row, data, categorical)

		return output
	except Exception as e :
		print(e)


# print("Enter Loan Id")
# loan_id = int(input())
# URL = "https://raw.githubusercontent.com/humbletechy/Assign/master/statistical.json"
# r = requests.get(URL, params=None)
# details = r.json()
# stat_score(loan_id, details)


