import configparser

config = configparser.ConfigParser()
config['dataset'] = { 
'location' : '/home/mehul/Downloads/datasets_9109_12699_german_credit_data.csv',
'change' : False,
'name' : "German",
'model' : '/home/mehul/Downloads/mifos_x/German.pkl'}
with open('config.ini', 'w') as configfile:
  config.write(configfile)