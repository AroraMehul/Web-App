import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder 
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import confusion_matrix, accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from abc import ABCMeta, abstractmethod
from sklearn.model_selection import GridSearchCV, ShuffleSplit
pd.options.mode.chained_assignment = None

class Strategy(metaclass=ABCMeta):
	def __init__(self, test_size, data, categorical, dataset="German", training_strategy = None):
		self.x = pd.DataFrame()
		self.y = []
		self.X_train = pd.DataFrame()
		self.y_train = []
		self.X_test = pd.DataFrame()
		self.y_test = []
		self.data = data
		self.categorical = categorical
		self.test_size = test_size
		self.model = ""
		self.training_strategy = training_strategy
		self.dataset = dataset

	def preprocessing(self):
		self.data.columns = self.data.columns.str.replace(" ", "_")
		self.data = self.data.dropna()
		le = LabelEncoder()
		for val in self.categorical:
		  self.data[val] = le.fit_transform(self.data[val])

		for col in self.data.columns:
		  if(col not in self.categorical):
		    self.data[col] = (self.data[col].astype('float') - np.mean(self.data[col].astype('float')))/np.std(self.data[col].astype('float'))

		if(self.dataset == "German"):
			self.data = self.data.drop(columns='Unnamed:_0')
			self.x = self.data.drop('Risk', axis=1)
			self.y = self.data['Risk'].astype('int')
		elif(self.dataset == "Australian"):
			self.x = self.data.drop(14, axis=1)
			self.y = self.data[14].astype('int')
		elif(self.dataset == "Japanese"):
			self.x = self.data.drop(15, axis=1)
			self.y = self.data[15].astype('int')
		elif(self.dataset == "Taiwan"):
			self.data = self.data.drop(columns='ID')
			self.x = self.data.drop('default_payment_next_month', axis=1)
			self.y = self.data['default_payment_next_month'].astype('int')
		elif(self.dataset == "Polish"):
			self.x = self.data.drop('class', axis=1)
			self.y = self.data['class'].astype('int')

		self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(self.x, self.y, test_size = self.test_size)
		self.X_train = pd.DataFrame(self.X_train)
		self.y_train = pd.DataFrame(self.y_train)
		sc = StandardScaler()
		self.X_train = sc.fit_transform(self.X_train)
		self.X_test = sc.transform(self.X_test)

		sc = StandardScaler()
		self.data = sc.fit_transform(self.data)

	def set_model(self):
		if(self.training_strategy):
			print(self.training_strategy)
			self.model = self.training_strategy(self)
			self.training_strategy = None

	def train(self):
		self.training_strategy = False
		self.model = self.model.fit(self.X_train, self.y_train.values.ravel())

	def predict(self):
		return self.model.predict(self.X_test)

	def test(self, test_row):
		return self.model.predict(test_row)

	def accuracy(self):
		y_pred = self.predict()
		cm = confusion_matrix(y_pred, self.y_test)
		return accuracy_score(self.y_test, y_pred, normalize=False)

	def metrics(self):
		y_pred = self.predict()
		cm = confusion_matrix(y_pred, self.y_test)
		acc_sc = accuracy_score(self.y_test, y_pred, normalize=True)
		f1 = f1_score(self.y_test, y_pred, average=None)
		return {"accuracy" : acc_sc, "f1" : f1, "confusion_matrix" : cm}


class SVM(Strategy):
	def __init__(self, test_size, data, categorical):
		super(SVM, self).__init__(test_size, data, categorical)

	def set_model(self):
		classifier = SVC()
		params = {'kernel' : ['poly'], 'degree' : [2, 3, 4]}
		#self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=10)
		self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=ShuffleSplit(test_size=0.20, n_splits=1, random_state=0))
		return self.model

class MLP(Strategy):
	def __init__(self, test_size, data, categorical):
		super(MLP, self).__init__(test_size, data, categorical)

	def set_model(self):
		classifier = MLPClassifier()
		params = {'hidden_layer_sizes' : [(100, 50 ,10)], 'max_iter' : [500], 'activation' : ['relu'], 'solver' : ['adam'], 'random_state' : [1]}
		#self.model = GridSearchCV(estimator=classifier, param_grid=params, n_jobs=-1, cv=10)
		self.model = GridSearchCV(estimator=classifier, param_grid=params, n_jobs=-1, cv=ShuffleSplit(test_size=0.20, n_splits=1, random_state=0))
		return self.model

class RandomForest(Strategy):
	def __init__(self, test_size, data, categorical):
		super(RandomForest, self).__init__(test_size, data, categorical)

	def set_model(self):
		classifier = RandomForestClassifier()
		params = {'n_estimators' : [20, 30, 40], 'random_state' : [0]}
		#self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=10)
		self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=ShuffleSplit(test_size=0.20, n_splits=1, random_state=0))
		return self.model

class GradientBoost(Strategy):
	def __init__(self, test_size, data, categorical):
		super(GradientBoost, self).__init__(test_size, data, categorical)

	def set_model(self):
		classifier = GradientBoostingClassifier()
		params = {'n_estimators' : [100, 200, 50], 'random_state' : [0], 'learning_rate' : [1.0], 'max_depth' : [1, 2, 3]}
		#self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=10)
		self.model = GridSearchCV(estimator=classifier, param_grid=params, cv=ShuffleSplit(test_size=0.20, n_splits=1, random_state=0))
		return self.model

def accuracy(Strategy):
	mod_acc = {}
	print("SVM")
	Strategy.model = SVM(Strategy.test_size, Strategy.data, Strategy.categorical).set_model()
	Strategy.preprocessing()
	Strategy.train()
	print(Strategy.metrics())
	mod_acc[Strategy.accuracy()] = Strategy.model

	print("MLP")
	Strategy.model = MLP(Strategy.test_size, Strategy.data, Strategy.categorical).set_model()
	Strategy.train()
	print(Strategy.metrics())
	mod_acc[Strategy.accuracy()] = Strategy.model

	print("GB")
	Strategy.model = GradientBoost(Strategy.test_size, Strategy.data, Strategy.categorical).set_model()
	Strategy.train()
	print(Strategy.metrics())
	mod_acc[Strategy.accuracy()] = Strategy.model

	print("RF")
	Strategy.model = RandomForest(Strategy.test_size, Strategy.data, Strategy.categorical).set_model()
	Strategy.train()
	print(Strategy.metrics())
	mod_acc[Strategy.accuracy()] = Strategy.model

	maxi = 0
	for key in mod_acc.keys():
		if(key > maxi):
			maxi = key
			Strategy.model = mod_acc[key]

	print(mod_acc.keys())
	return Strategy.model

def explainabiltiy(Strategy):
	return GradientBoost(Strategy.test_size, Strategy.data, Strategy.categorical).set_model()

def getMLScore(loan_id, dataset="German"):
	if(dataset == "German"):
		data = pd.read_csv("/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv")
		categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']

	if(dataset == "Taiwan"):
		data = pd.read_excel('credit.xls')
		categorical = []
		colnames = data.iloc[0]
		data = data[1:]
		data.columns = colnames

	if(dataset == "Australian"):
		data = [i.strip().split() for i in open("./australian.dat").readlines()]
		data = pd.DataFrame(data)
		categorical = []

	if(dataset == "Japanese"):
		data = [i.strip().split(",") for i in open("./crx.data").readlines()]
		data = pd.DataFrame(data)
		indices = []
		for idx, row in data.iterrows():
			if("?" in row.values):
				indices.append(idx)
		data.drop(data.index[[indices]], inplace=True)
		categorical = [0,3,4,5,6,8,9,11,12,15]

	if(dataset == "Polish"):
		year_1 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/1year.csv')
		year_2 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/2year.csv')
		year_3 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/3year.csv')
		year_4 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/4year.csv')
		year_5 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/5year.csv')
		data = pd.concat([year_1, year_2, year_3, year_4, year_5], ignore_index=True)
		categorical = []
		indices = []
		for idx, row in data.iterrows():
			if("?" in row.values):
				indices.append(idx)
		data.drop(data.index[[indices]], inplace=True)

	mod = Strategy(0.2, data, categorical, dataset, training_strategy=accuracy)
	mod.set_model()
	mod.train()
	data.columns = data.columns.str.replace(" ", "_")
	data = data.dropna()
	data = data.drop(columns='Unnamed:_0')
	#data = data.drop(14, axis=1)
	le = LabelEncoder()
	for val in categorical:
	  data[val] = le.fit_transform(data[val])
		#self.data = self.data.drop(columns='ID')
	for col in data.columns:
	  if(col not in categorical):
	    data[col] = (data[col].astype('float') - np.mean(data[col].astype('float')))/np.std(data[col].astype('float'))
	#print(data.loc[loan_id,'Risk'])
	data = data.drop('Risk', axis=1)
	#data = data.drop(15, axis=1)
	#data = data.drop(["ID", "default_payment_next_month"], axis=1)
	#data = data.drop('class', axis=1)
	test_row = np.array(data.iloc[int(loan_id)]).reshape(1,-1)
	print(mod.test(test_row))
	acc = mod.metrics()
	#print(acc['accuracy'])
	scorecard = {"accuracy" : acc['accuracy'], "result" : int(mod.test(test_row)[0])}
	print(scorecard)
	return scorecard


# German Dataset


getMLScore(3)

# Taiwan Dataset
# data = pd.read_excel('credit.xls')
# categorical = []
# colnames = data.iloc[0]
# data = data[1:]
# data.columns = colnames

#Australian Dataset
# data = [i.strip().split() for i in open("./australian.dat").readlines()]
# data = pd.DataFrame(data)
# categorical = []

#Japanese Dataset
# data = [i.strip().split(",") for i in open("./crx.data").readlines()]
# data = pd.DataFrame(data)
# indices = []
# for idx, row in data.iterrows():
# 	if("?" in row.values):
# 		indices.append(idx)
# data.drop(data.index[[indices]], inplace=True)
# categorical = [0,3,4,5,6,8,9,11,12,15]

#Polish Dataset
# year_1 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/1year.csv')
# year_2 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/2year.csv')
# year_3 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/3year.csv')
# year_4 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/4year.csv')
# year_5 = pd.read_csv('/home/mehul/Downloads/mifos_x/ML_models/data/5year.csv')
# data = pd.concat([year_1, year_2, year_3, year_4, year_5], ignore_index=True)
# categorical = []
# indices = []
# for idx, row in data.iterrows():
# 	if("?" in row.values):
# 		indices.append(idx)
# data.drop(data.index[[indices]], inplace=True)

