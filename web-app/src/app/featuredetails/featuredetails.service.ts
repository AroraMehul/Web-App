import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
import { HttpRequestService } from 'app/shared/HttpRequestService';

@Injectable()
export class FeatureDetailsService {

    constructor(private _httpService: HttpRequestService, private _router: Router) { }

    public getAllFeatures( successcallback) {
        let responseObject: any;
        this._httpService.getRequest(Config.getEnvironmentVariable('getAllFeatures'))
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