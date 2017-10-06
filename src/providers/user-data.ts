import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
    _favorites:string[] = [];
    _accessToken:string = '';
    _currentDev:string = '';

    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

    constructor(public events:Events,
                public storage:Storage) {

        var self = this;
        this.storage.get('accessToken').then((value) => {
            self._accessToken = value;
            console.log('SAVED ACCESS TOKEN: ', this._accessToken, );
        });
        this.storage.get('currentDev').then((value) => {
            self._currentDev = value;
        })
    }

    accessToken() {
        return this._accessToken;
    }

    currentDev() {
        return this._currentDev;
    }

    setCurrentDev(pid) {
        if(this._currentDev!=pid) {
            this._currentDev = pid;
            this.storage.set('currentDev', pid);
        }
    }

    hasFavorite(sessionName:string):boolean {
        return (this._favorites.indexOf(sessionName) > -1);
    }

    addFavorite(sessionName:string):void {
        this._favorites.push(sessionName);
    }

    removeFavorite(sessionName:string):void {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    }

    login(username:string, accessToken:string):void {
        console.log('SAVED SESSION: ', username, accessToken)
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.setAccessToken(accessToken);
        this.events.publish('user:login');
    }

    signup(username:string, accessToken:string):void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.setAccessToken(accessToken);
        this.events.publish('user:signup');
    }

    logout():void {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.storage.remove('accessToken');
        this.events.publish('user:logout');
    }

    setUsername(username:string):void {
        this.storage.set('username', username);
    }

    getUsername():Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }

    setAccessToken(accessToken:string):void {
        this._accessToken = accessToken;
        this.storage.set('accessToken', accessToken);
    }

    getAccessToken():Promise<string> {
        return this.storage.get('accessToken').then((value) => {
            return value;
        });
    }

    hasLoggedIn():Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            if(value) return true;
            return false;
        });
    }

    checkHasSeenTutorial():Promise<string> {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
            return value;
        });
    }
}
