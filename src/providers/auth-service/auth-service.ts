import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserData } from '../user-data';
import { AppConfig } from '../../lib/config/app-config';
import { Crypto } from '../../lib/security/security';
import { RequestUtil } from '../../lib/util/request-util';


/*
 Generated class for the AuthServiceProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class AuthServiceProvider {

    public accessToken:string = '';
    public userName:string = '';

    constructor(public http:Http,
                public appConfig:AppConfig,
                public userData:UserData) {
    }

    login(userName:string, password:string):Promise<boolean> {
        var reqUtil = new RequestUtil();
        var crypto = new Crypto();

        var qs = reqUtil.sortedQueryString({"username": userName, "pwd": password});
        var a = crypto.arc4Encode(qs, this.appConfig.APP_SECRET);
        var h = crypto.hmacEncode(qs, this.appConfig.APP_SECRET);

        qs = reqUtil.sortedQueryString({
            'k': this.appConfig.APP_KEY,
            'a': a, 'h': h, 'v': this.appConfig.APP_VERSION
        });
        var self = this;
        return new Promise(resolve => {
            this.http.get(this.appConfig.SSO_SERVER + 'oem_cp_tk?' + qs).subscribe(data => {
                if (data.status == 200) {
                    var accessToken = data.text();
                    self.userData.login(userName, accessToken);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

}
