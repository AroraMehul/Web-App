from flask import Flask, jsonify, request, Response
import json
import requests
import configparser
# from views.ConfigurationOperations import getAllConfigurationFromDB, getByConfigId, saveAConfiguration
# from views.CriteriaOperations import getAllCriteriaFromDB, getByCriteriaId, saveCriteria
# from views.FeatureOperations import getByFeatureId, getAllFeaturesFromDB, saveAFeature, getFeatureNCategoryFromDB

from flask_cors import CORS

from scorecard_backend.views.ConfigurationOperations import getAllConfigurationFromDB, getByConfigId, saveAConfiguration
from scorecard_backend.views.CriteriaOperations import getAllCriteriaFromDB, getByCriteriaId, saveCriteria
from scorecard_backend.views.FeatureOperations import getByFeatureId, getAllFeaturesFromDB, getFeatureNCategoryFromDB, \
    saveAFeature
from scorecard_backend.views.ScorecardOperations import getByAge, getByGender, getByJSON, getByXML
from ML_models.Strategy import getMLScore
from statistical_scripts.statistical_scoring import stat_score 


app = Flask(__name__)
CORS(app)
# app = Flask(__name__)
#cors = CORS(app, resources={r"/feature/*": {"origins": "*"}})


@app.route('/')
def hello_world():
    return 'Hello World'
#
# Feature
# operations
@app.route('/feature/getByFeatureId', methods=['POST'])
def getSingleFeature():
    return json.dumps(getByFeatureId(int(request.json['id'])).__dict__), 200, {'ContentType': 'application/json'}
    # return Response(json.dumps(getByFeatureId(int(request.json['id'])).__dict__), mimetype='application/json')

@app.route('/feature/getAllFeatures')
def getAllFeatures():
    return Response(json.dumps(getAllFeaturesFromDB()),  mimetype='application/json')

@app.route('/feature/saveFeature',  methods=['POST'])
def saveTheFeature():
    # feature, value, data, category, status
    data = request.json
    print(request.json['id'])
    #values = (data['feature'],data['value'],data['data'],data['category'],data['status'])
    return saveAFeature(data['id'],data['feature'],data['value'],data['data'],data['category'],data['status'])

@app.route('/feature/featureNCategory')
def getFeatureAndCategory():
    return Response(json.dumps(getFeatureNCategoryFromDB()), mimetype='application/json')


#
# configuration
# operations
@app.route('/config/getByConfigId', methods=['POST'])
def getSingleConfiguration():
    return json.dumps(getByConfigId(int(request.json['id'])).__dict__), 200, {'ContentType': 'application/json'}

@app.route('/config/getAllConfig')
def getAllConfiguration():
    return Response(json.dumps(getAllConfigurationFromDB()),  mimetype='application/json')

@app.route('/config/saveConfig',  methods=['POST'])
def saveTheConfiguration():
    # feature, value, data, category, status
    data = request.json
    # print(request.json['id'])
    return saveAConfiguration(data['id'],data['feature'],data['category'],data['product'],str(data['weightage']),data['greenmax'],data['greenmin'],
    data['ambermax'],data['ambermin'],data['redmax'],data['redmin']);


#criteria
@app.route('/criteria/getAllCriterias')
def getAllCriteria():
    return Response(json.dumps(getAllCriteriaFromDB()),  mimetype='application/json')

@app.route('/criteria/getByCriteriaId', methods=['POST'])
def getSingleCriteria():
    return json.dumps(getByCriteriaId(int(request.json['id'])).__dict__), 200, {'ContentType': 'application/json'}

@app.route('/score/calc', methods=['POST'])
def getCriteriaScore():
    scoreAge = getByAge(request.json['age']);
    scoreGender = getByGender(request.json['gender']);
    return jsonify(
        ageScore=scoreAge["score"],
        ageColor=scoreAge["color"],
        genderScore=scoreGender["score"],
        genderColor=scoreGender["color"],
    )

@app.route('/score/calc/json', methods=['POST'])
def getCriteriaScoreJSON():
    scorecard = getByJSON(request.json['loan_id']);
    return jsonify(
        scorecard=scorecard
    )

@app.route('/score/calc/xml', methods=['POST'])
def getCriteriaScoreXML():
    scorecard = getByXML(request.json['loan_id']);
    return jsonify(
        scorecard=scorecard
    )

@app.route('/criteria/saveCriteria',  methods=['POST'])
def saveTheCriteria():
    # feature, value, data, category, status
    data = request.json
    # print(request.json['id'])
    # values = (data['feature'],data['value'],data['data'],data['category'],data['status'])
    return saveCriteria(data['id'],data['feature'],data['category'],data['product'],data['datasource'],data['keyvalue'], data['sqlapi'], data['scoreCriteria'])

@app.route('/score/calc/ml', methods=['POST'])
def getScoreML():
    scorecard = getMLScore(request.json['loan_id']);
    return jsonify(
        scorecard=scorecard
    )

@app.route('/score/calc/stat', methods=['POST'])
def getScoreStat():
    scorecard = stat_score(request.json['loan_id'], request.json['stat_model']);
    return jsonify(
        scorecard=scorecard
    )

@app.route('/upload/csv', methods=['POST'])
def upload():
    config = configparser.ConfigParser()
    config.read('config.ini')
    print(request.json['file'])
    URL = request.json['file']
    status = True
    r = requests.get(URL, params=None)
    status = r.status_code
    if(r.status_code == 200):
        config.set('dataset', 'location', URL)
        with open('config.ini', 'w') as configfile:
            config.write(configfile)
    return jsonify(
        status=status
    )

# main driver function
if __name__ == '__main__':
    app.run()