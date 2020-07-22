import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder 
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn.preprocessing import OneHotEncoder
pd.options.mode.chained_assignment = None 

class MLP():
	def __init__(self, activation, test_size, solver, hidden_layer_sizes, data):
		self.activation = activation
		self.test_size = test_size
		self.solver = solver
		self.hidden_layer_sizes = hidden_layer_sizes
		self.data = data
		self.x = pd.DataFrame()
		self.y = []
		self.X_train = pd.DataFrame()
		self.y_train = []
		self.X_test = pd.DataFrame()
		self.y_test = []

	def preprocessing(self):
		self.data.columns = self.data.columns.str.replace(" ", "_")
		self.data = self.data.dropna()
		categorical = ['Sex', 'Housing', 'Saving_accounts', 'Checking_account', 'Purpose', 'Risk']

		le = LabelEncoder()
		for val in categorical:
		  self.data[val] = le.fit_transform(self.data[val])

		self.data = self.data.drop(columns='Unnamed:_0')
		for col in self.data.columns:
		  if(col not in categorical):
		    self.data[col] = (self.data[col] - np.mean(self.data[col]))/np.std(self.data[col])

		self.x = self.data.drop('Risk', axis=1)
		self.y = self.data['Risk']
		self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(self.x, self.y, test_size = self.test_size)
		self.X_train = pd.DataFrame(self.X_train)
		self.y_train = pd.DataFrame(self.y_train)
		sc = StandardScaler()
		self.X_train = sc.fit_transform(self.X_train)
		self.X_test = sc.transform(self.X_test)

		sc = StandardScaler()
		self.data = sc.fit_transform(self.data)

	def train(self, max_iter):
		self.preprocessing()
		classifier = MLPClassifier(hidden_layer_sizes=self.hidden_layer_sizes, max_iter=max_iter, activation =self.activation, solver=self.solver, random_state=1)
		classifier.fit(self.X_train, self.y_train.values.ravel())
		return classifier

	def predict(self, classifier):
		return classifier.predict(self.X_test)

	def accuracy(self, classifier):
		y_pred = self.predict(classifier)
		cm = confusion_matrix(y_pred, self.y_test)
		return cm

data = pd.read_csv("/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv")
model = MLP('relu', 0.2, 'adam', (100,150,50), data)
classifier = model.train(5000)
print(model.accuracy(classifier))