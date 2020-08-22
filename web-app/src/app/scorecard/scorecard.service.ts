import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpRequestService } from "app/shared/HttpRequestService";
import { Config } from "app/shared/Configuration";
@Injectable()
export class ScoreCardService {

  constructor(private _httpService: HttpRequestService, private _router: Router) {}
  public getLoan(successcallback) {
    let responseObject: any;
    this._httpService
      .getRequest("https://demo.mifos.io/fineract-provider/api/v1/loans?tenantIdentifier=default&pretty=true")
      .subscribe(
        (data) => {
          responseObject = data;
          successcallback(responseObject);
        },
        (error) => console.log("error"),
        () => {
          console.log("success ");
        }
      );
  }
  public getClientDetails(successcallback, loanId, openSnackBar) {
    let responseObject: any;
    this._httpService
      .getRequest(
        "https://demo.mifos.io/fineract-provider/api/v1/clients/" + loanId + "?tenantIdentifier=default&pretty=true"
      )
      .subscribe(
        (data) => {
          responseObject = data;
          successcallback(responseObject);
        },
        (error) => {
          openSnackBar("error");
          console.log("error2");},
        () => {
          console.log("success ");
        }
      );
  }

  public getAllScore(successcallback, ag, gen) {
    let reObject = {
      age: ag,
      gender: gen,
    };

    let responseObject: any;
    this._httpService.postRequest(Config.getEnvironmentVariable("getScore"), reObject).subscribe(
      (data) => {
        responseObject = data;
        successcallback(responseObject);
      },
      (error) => console.log("error1"),
      () => {
        console.log("success ");
      }
    );
  }

/**
 * JSON Score Extraction
 */
  public getJsonScore(jsonsuccesscallback, loan_id, errorCallBack) {

    let responseObject: any;
    let payload = {
      loan_id
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("getJsonScore"), payload).subscribe(
      (data) => {
        responseObject = data;
        jsonsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );
  }

/**
 * XML Score Extraction
 */

  public getXmlScore(xmlsuccesscallback, loan_id, errorCallBack) {

    let responseObject: any;
    let payload = {
      loan_id
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("getXmlScore"), payload).subscribe(
      (data) => {
        responseObject = data;
        xmlsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );
  }

/**
 * Statistical Score Extraction
 */

  public getStatScore(statsuccesscallback, loan_id, stat_model, errorCallBack){

    let responseObject: any;
    let payload = {
      loan_id,
      stat_model
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("getStatScore"), payload).subscribe(
      (data) => {
        responseObject = data;
        statsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );

  }

/**
 * ML Score Extraction
 */

  public getMLScore(mlsuccesscallback, loan_id, errorCallBack){

    let responseObject: any;
    let payload = {
      loan_id
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("getMLScore"), payload).subscribe(
      (data) => {
        responseObject = data;
        mlsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );

  }

/**
 * CSV Upload
 */

  public uploadCSV(uploadsuccesscallback, file, errorCallBack){

    let responseObject: any;
    console.log("File");
    console.log(file);
    let payload = {
      file
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("uploadCSV"), payload).subscribe(
      (data) => {
        responseObject = data;
        uploadsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );

  }

  public getRBScore(rbsuccesscallback, loan_id, errorCallBack){
    let responseObject: any;
    let payload = {
      loan_id
    }
    this._httpService.postRequest(Config.getEnvironmentVariable("getRBScore"), payload).subscribe(
      (data) => {
        responseObject = data;
        rbsuccesscallback(responseObject);
      },
      (error) => {
        errorCallBack(error);
        console.log(error);},
      () => {
        console.log("success ");
      }
    );
  }


}
