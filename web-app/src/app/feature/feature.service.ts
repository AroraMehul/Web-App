import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
import { HttpRequestService } from 'app/shared/HttpRequestService';
@Injectable()
export class FeatureService {

    constructor(private _httpService: HttpRequestService, private _router: Router) { }

    public saveFeature(featureObj, successcallback, errorCallBack) {
        let responseObject: any;
        const request = {
            id: featureObj.id,
            feature: featureObj.feature,
            value: featureObj.valueType,
            data: featureObj.dataType,
            category: featureObj.category,
            status : featureObj.status
        }
        this._httpService.postRequest(Config.getEnvironmentVariable('saveFeature'), request)
            .subscribe(
                (data) => {
                    responseObject = data;
                    console.log(data);
                    successcallback(responseObject);
                },
                (error) => {
                    errorCallBack(error);
                    console.log(error);},
                () => {
                    console.log('success ');
                }
            );
    }

    public getOneFeature(featureId, successcallback, errorCallBack) {
        let responseObject: any;
        const request = {
            id : featureId
        }
        // console.log(JSON.stringify(request));
        this._httpService.postRequest(Config.getEnvironmentVariable('getOneFeature'), request)
            .subscribe(
                (data) => {
                    responseObject = data;
                    successcallback(responseObject);
                },
                (error) => {
                    errorCallBack(error);
                    console.log('err');},
                () => {
                    console.log('success ');
                }
            );
    }

}
