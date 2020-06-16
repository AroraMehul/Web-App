import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
// import { HttpRequestService } from '../shared/services/http-request.service';
import { HttpRequestService } from 'app/shared/HttpRequestService';
@Injectable()
export class CriteriaService {

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

    public saveCriteria(criteriaObj, successcallback, errorcallback) {
        let responseObject: any;
        console.log(criteriaObj.id)
        const request = {
            id: criteriaObj.id,
            feature: criteriaObj.feature,
            category:criteriaObj.category,
            product:criteriaObj.product,
            datasource:criteriaObj.datasource,
            keyvalue:criteriaObj.keyvalue,
            sqlapi : criteriaObj.sqlapi,
            scoreCriteria: criteriaObj.scoreCriteria
        }
        this._httpService.postRequest(Config.getEnvironmentVariable('saveCriteria'), request)
            .subscribe(
                (data) => {
                    responseObject = data;
                    successcallback(responseObject);
                },
                (error) => {
                errorcallback(error);
                },
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

    public getOneCriteria(criteriaID, successcallback) {
        let responseObject: any;
        const request = {
            id : criteriaID
        }
        // console.log(JSON.stringify(request));
        this._httpService.postRequest(Config.getEnvironmentVariable('getOneCriteria'), request)
            .subscribe(
                (data) => {
                    responseObject = data;
                    successcallback(responseObject);
                    console.log(data);
                },
                (error) => console.log('err'),
                () => {
                    console.log('success ');
                }
            );
    }
}
