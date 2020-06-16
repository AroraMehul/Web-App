import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
import { HttpRequestService } from 'app/shared/HttpRequestService';
@Injectable()
export class FeatureService {

    constructor(private _httpService: HttpRequestService, private _router: Router) { }

    public getValueData(valuecallback) {

        this._httpService.getRequest('<url>').subscribe(
        (data) => {
            let valueDataOptions = data;
            valuecallback(valueDataOptions);
        },
        (error) => {
            let defaultValues = ["a", "b", "c"];
            valuecallback(defaultValues);
            console.log("err")
        },
        )

    }

    public saveFeature(featureObj, successcallback) {
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
                (error) => {console.log(error);},
                () => {
                    console.log('success ');
                }
            );
    }

    public getOneFeature(featureId, successcallback) {
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
                (error) => console.log('err'),
                () => {
                    console.log('success ');
                }
            );
    }

}
