import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

//import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { Events, LoadingController } from 'ionic-angular';

@Component({
    // selector force Ionic render page under <page-user></page-user> tags
    // otherwise, Ionic will render page under <ng-component></ng-component> tags
    // this will help css selector more easily
    selector: 'page-user',
    templateUrl: 'login.html'
})

export class LoginPage {
    login:UserOptions = {username: '', password: ''};
    loading: any;
    submitted = false;

    constructor(public navCtrl:NavController,
                public loadingCtrl:LoadingController,
                public events: Events,
                public userData:UserData,
                public authService:AuthServiceProvider) {
        this.loading = this.loadingCtrl.create({
            content: 'Loging in...'
        });
    }

    onLogin(form:NgForm) {
        this.submitted = true;
        //var navCtrl = this.navCtrl;
        if (form.valid) {
            this.loading.present();
            this.authService.login(this.login.username, this.login.password).then((result) => {
                console.log('LOGIN RESULT: ', result);
                this.loading.dismiss();
                if (result) {
                    //login event fired inside AuthService. So we no need to do anything here
                } else {
                    console.log('login incorrect!');
                }
            });
        }
    }

    onSignup() {
        this.navCtrl.push(SignupPage);
    }
}
