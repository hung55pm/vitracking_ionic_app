import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ApiProvider } from './api/api';
import { UserData } from './user-data';


/// return Observable => co the Map duoc
/// return Map => co the Subscribe duoc


/*
 Generated class for the DevDataProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class DevDataProvider {
    data: any;
    devList: any;

    constructor(public api: ApiProvider, public userData: UserData) {
    }

    load() : any {
        //if (this.data) {
        //    return Observable.of(this.data);
        //} else {
        //    return this.api.devList()
        //        .map(this.processData.bind(this));
        //}
    }

    currentDev() {
        if(this.devList && Object.keys(this.devList).length) {
            var pid = this.userData.currentDev();
            if(pid && this.devList[pid]) {
                return this.devList[pid];
            } else {
                var key = Object.keys(this.devList)[0];
                return this.devList[key];
            }
        }
    }

    getDevList() {
        if(this.devList && Object.keys(this.devList).length) {
            return Observable.of(this.devList);
        } else {
            return new Observable(observer => {
                // get all device bound to current account
                this.api.devList().then( (devList:any[]) => {
                    var all:any[] = [];
                    this.devList = {};
                    // each device, we will get all related information
                    // by making an array of promise and execute all at once
                    if(!Array.isArray(devList)){
                        observer.next(this.devList);
                        return;
                    }

                    devList.forEach(dev => {
                        this.devList[dev.id] = {p: dev.p, id: dev.id};
                        // get device's information (name, birthday...)
                        all.push(this.api.devInfo(dev.id));
                        // get device's family member
                        all.push(this.api.devMembers(dev.id));
                    });
                    // download all device's information and members at the same time
                    Promise.all(all).then(data => {
                        console.log(data);
                        data.forEach(d => {
                            var dev = this.devList[d.id];
                            if(d.info) dev.info = d.info;
                            if(d.members) dev.members = d.members;
                        });
                        // now, download all device's image at the same time
                        all = [];
                        for(var id in this.devList) {
                            var dev = this.devList[id];
                            if(dev.info) {
                                var img_token = dev.info.img_r;
                                if(img_token) {
                                    all.push(this.api.devImg(id, img_token));
                                }
                            }
                        }
                        Promise.all(all).then(data => {
                            if(data){
                                data.forEach(d => {
                                    var dev = this.devList[d.id];
                                    if(d.img && !d.img.err) dev.img = d.img;
                                });
                            }
                            observer.next(this.devList);
                        });
                    })
                });

            });
        }
    }

    getLocations(pids) {
        return new Observable(observer => {
            var all : any = [];
            pids.forEach(pid => {
                all.push(this.api.gpsLoc(pid));
            });

            Promise.all(all).then(data => {
                observer.next(data);
            })
        });
    }


}
