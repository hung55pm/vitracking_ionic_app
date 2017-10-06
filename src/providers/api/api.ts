import { Injectable } from '@angular/core';
// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


import { HttpProvider } from '../http/http';
import { Crypto } from '../../lib/security/security';

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class ApiProvider {

    constructor(public http:HttpProvider) {
    }

    devList():Promise<any> {
        return this.http.dev('list', null);
    }

    errorHandle(e: any) {
        console.log('ERR HANDLE: ', e);
        return e;
    }

    devInfo(pid):Promise<any> {
    	return new Promise(resolve => {
    		this.http.sync_from('pt33', pid, 1, pid).then(info => {
                var ret = {id: pid, info: {}};
    			if(info['fs']) {
    				var crypto = new Crypto();
    				var fs = crypto.base64DecodeLatin1(info['fs']);
                    ret.info = JSON.parse(fs.substring(3));
    			}
                resolve(ret);
    		});
    	});
    }

    devMembers(pid):Promise<any> {
        return new Promise(resolve => {
            this.http.dev('members', {id: pid}).then(data => {
                var ret = {id: pid, members: {}};
                ret.members = data;
                resolve(ret);
            })
        });
    }

    devImg(pid, img_r) {
        return new Promise(resolve => {
            this.http.res('pt33', pid, 'file_tk', {
                r: img_r,
                m: '1', share:1, fn: 'img_' + pid
            }).then((data:any) => {
                var ret = {id: pid, img: ''};
                var token = data.tk;
                //var by = data.by;
                this.http.download({r: img_r, tk: token}).then( (file:any) => {
                    // convert raw image to base64 image using Blob and FileReader
                    var blob:Blob = new Blob([file.arrayBuffer()], {type: 'image/jpeg'});
                    var reader = new FileReader();
                    reader.onload = function() {
                        var dataUrl = reader.result;
                        ret.img = dataUrl;
                        resolve(ret);
                    }
                    reader.readAsDataURL(blob);
                });
            }).catch(this.errorHandle);
        });
    }

    gpsLoc(pid) {
        return new Promise(resolve => {
            this.http.res('pt33', pid, 'gps_loc', null)
                .then( (data:any) => {
                resolve({pid: pid, data: data});
            });
        });

    }

    trackHistory(pid, fromDate, toDate){
        return this.http.res('pt33', pid, 'gps_history', {begin: fromDate, end: toDate});
    }
}
