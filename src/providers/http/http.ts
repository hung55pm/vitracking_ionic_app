import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';

//import 'rxjs/add/operator/map';
import { RequestUtil } from '../../lib/util/request-util';
import { Crypto } from '../../lib/security/security';
import { AppConfig } from '../../lib/config/app-config';
import { UserData } from '../user-data';

//import { Observable } from 'rxjs/Observable';
// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

//import 'rxjs/add/observable/of';

/*
 Generated class for the HttpProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */


@Injectable()
export class HttpProvider {

    constructor(public http:Http, public appConfig:AppConfig, public userData:UserData) {

    }

    private http_post(url:string, data:any) {
        if(this.userData.accessToken() == null) {
            return new Promise(resolve => {resolve(0)});
        }
        var api_url = this.appConfig.API_SERVER + url;
        var reqUtil = new RequestUtil();
        var crypto = new Crypto();

        var qs = reqUtil.sortedQueryKeyValue(data);
        var base = 'POST' + api_url + qs + this.appConfig.APP_SECRET;
        //console.log('BASE: ', encodeURIComponent(base));
        var sign = crypto.md5Encode(encodeURIComponent(base));
        if(data == null){
            data = {};
        }
        data['_tk'] = this.userData.accessToken();
        data['_sign'] = sign;

        console.log('POST: ', api_url , data);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        return new Promise(resolve => {
            this.http.post(api_url, reqUtil.queryString(data), options)
                .map(res=>res.json())
                .subscribe((data) => {
                    console.log('RESP: ', data);
                    resolve(data);
                }, err => {
                    console.log('REQ ERR: ', err)
                    resolve({err: {status: err.status, statusText: err.statusText}});
                });
        });
    }

    private http_get(url:string, data:any) {

        if(this.userData.accessToken() == null) {
            return new Promise(resolve => {resolve(0)});
        }
        var api_url = this.appConfig.API_SERVER + url;

        var reqUtil = new RequestUtil();
        var crypto = new Crypto();

        var qs = reqUtil.sortedQueryKeyValue(data);
        var base = 'GET' + api_url + qs + this.appConfig.APP_SECRET;
        //console.log('BASE', encodeURIComponent(base));
        var sign = crypto.md5Encode(encodeURIComponent(base));
        api_url = api_url + '?' + reqUtil.queryString(data) + "&_tk=" + this.userData.accessToken() + "&_sign=" + sign;
        console.log('GET: ', api_url);

        return new Promise(resolve => {
            this.http.get(api_url)
                .map(res=>res.json())
                .subscribe((data) => {
                    console.log('RESP: ', data);
                    resolve(data);
                }, err => {
                    console.log('REQ ERR: ', err)
                    resolve({err: {status: err.status, statusText: err.statusText}});
                });
        });
    }

    private http_download_file(url: string, data: any) {
        var file_url = this.appConfig.FILE_SERVER + url;
        var reqUtil = new RequestUtil();
        var qs = reqUtil.sortedQueryString(data);
        file_url = file_url + '?' + qs;
        console.log('DOWNLOAD: ', file_url);
        let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
        return new Promise(resolve => {
            this.http.get(file_url, options)
                .map(res => res)
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    console.log('REQ ERR: ', err)
                });
        });
    }

    download(data: any) {
        return this.http_download_file('down', data);
    }

    dev(operation:string, data:any){
        return this.http_post('dev/' + operation, data);
    }
    res(devType, pid, operation:string, data:any){
        return this.http_get('res/' + devType + '/' + pid + '/' + operation, data);
    }
    ctrl(devType: string, pid:string, operation: string, data:any) {
        return this.http_post('ctrl/' + devType + '/' + pid + '/' + operation, data);
    }

    sync_from(devType, pid, share, repo:string) {
        return this.ctrl(devType, pid, 'syncfrom_req', {
                'share': share, 'repo': repo, 'bc':0,'bs':0,'ls':0,'md5':'','r':''
            });
    }

}
