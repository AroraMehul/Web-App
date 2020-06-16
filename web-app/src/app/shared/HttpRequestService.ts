import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map';
@Injectable()
export class HttpRequestService {
  constructor(private http: Http) { }
  public getRequest(urlPath: string): Observable<any> {

    const _headers = new Headers({ 'Content-type': 'application/json' ,  'Authorization': 'Basic ' + btoa('mifos:password')});
    const options = new RequestOptions({ headers: _headers });
    return this.http.get(urlPath, options)
      .pipe(map((resObj: Response) => resObj.json()));
      // .map((resObj: Response) => resObj.json())
    //   .catch((errorObj: any) => Observable.throw(errorObj.json.error || 'Server Error'));
  }
  public postRequest(urlPath: string, postData: any): Observable<any> {
    const _headers = new Headers({ 'Content-type': 'application/json' ,  'Authorization': 'Basic ' + btoa('mifos:password')});
    const options = new RequestOptions({ headers: _headers });
    return this.http.post(urlPath, postData, options)
    .pipe(map((resObj: Response) => resObj.json()));

    //   .catch((res: Response) => this.onError(res));
  }
  onError(res: Response) {
    const statusCode = res.status;
    const body = res.json();
    const error = {
      statusCode: statusCode,
      error: body.error
    };
    return throwError(error);
  }
}
