import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder 
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

class SVM():
	def __init__(self, test_size, kernel, degree, data):
		self.test_size = test_size
		self.kernel = kernel
		self.degree = degree
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

	def train(self):
		self.preprocessing()
		classifier = SVC(kernel=self.kernel, degree=self.degree)
		classifier.fit(self.X_train, self.y_train.values.ravel())
		return classifier

	def predict(self, classifier):
		return classifier.predict(self.X_test)

	def accuracy(self, classifier):
		y_pred = self.predict(classifier)
		cm = confusion_matrix(y_pred, self.y_test)
		return cm

data = pd.read_csv("/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv")
model = SVM(0.2, 'poly', 2, data)
classifier = model.train()
print(model.accuracy(classifier))