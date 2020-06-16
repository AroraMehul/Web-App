import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../shared/Configuration';
import { HttpRequestService } from 'app/shared/HttpRequestService';
// import { HttpRequestService } from '../shared/services/http-request.service';

@Injectable()
export class ConfigDetailsService {

    constructor(private _httpService: HttpRequestService, private _router: Router) { }

    public getAllConfigs( successcallback) {
        let responseObject: any;
        this._httpService.getRequest(Config.getEnvironmentVariable('getAllConfigs'))
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