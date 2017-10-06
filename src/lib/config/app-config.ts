import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

/*
 Generated class for the UtilProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class AppConfig {

    APP_KEY: string = '902ff02fa16e425eab5acb4a20a68403';
    APP_SECRET: string = '755605a380f9415aa57921d75d7ad015';
    APP_VERSION: string = '1.0';

    SSO_SERVER = "http://117.4.242.84:8002/"
    API_SERVER = "http://117.4.242.84:8000/"
    FILE_SERVER = "http://117.4.242.84:8004/"


    constructor() {
    }

}