import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
// import { HttpRequestService } from '../shared/services/http-request.service';
import { HttpRequestService } from 'app/shared/HttpRequestService';
@Injectable()
export class ConfigService {

    constructor(private _httpService: HttpRequestService, private _router: Router) { }

    public getCategoryFeature(successcallback){
      let responseObject :any;
      this._httpService.getRequest(Config.getEnvironmentVariable('getFeatureCatgory'))
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
    public saveConfig(criteriaObj, successcallback) {
        let responseObject: any;
        const request = {
            feature : criteriaObj.feature,
            category: criteriaObj.category,
            product : criteriaObj.product,
            weightage : criteriaObj.weightage,
            // colour1: criteriaObj.feature,
            greenmin: criteriaObj.greenmin.toString(),
            greenmax: criteriaObj.greenmax.toString(),

            // colour2: criteriaObj.feature,
            ambermin: criteriaObj.ambermin.toString(),
            ambermax: criteriaObj.ambermax.toString(),

            // colour3: criteriaObj.feature,
            redmin: criteriaObj.redmin.toString(),
            redmax: criteriaObj.redmax.toString(),
            id: criteriaObj.id

        }
        this._httpService.postRequest(Config.getEnvironmentVariable('saveConfig'), request)
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

    public getOneFeature(configId, successcallback) {
        let responseObject: any;
        const request = {
            id : configId
        }
        console.log(JSON.stringify(request));
        this._httpService.postRequest(Config.getEnvironmentVariable('getOneConfig'), request)
            .subscribe(
                (data) => {
                    responseObject = data;
                    successcallback(responseObject);
                    console.log(JSON.stringify(data));
                },
                (error) => console.log('err'),
                () => {
                    console.log('success ');
                }
            );
    }
    public readJSONfile(successcallback){
      this._httpService.getRequest("/assets/json-resources/products.json").subscribe(
        (data) =>{
          successcallback(data);
        console.log(data);
        // this.products = data;
      });
    }
}
