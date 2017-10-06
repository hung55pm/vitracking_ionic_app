import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs-page/tabs-page';
import { LoginPage } from '../login/login';
import { UserData } from '../../providers/user-data';


@Component({
    // selector force Ionic render page under <page-tutorial></page-tutorial> tags
    // otherwise, Ionic will render page under <ng-component></ng-component> tags
    // this will help css selector more easily
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html'
})

export class TutorialPage {
    showSkip = true;

    @ViewChild('slides') slides:Slides;

    constructor(public navCtrl:NavController,
                public menu:MenuController,
                public storage:Storage,
                public userData:UserData) {
    }

    startApp() {
        this.userData.hasLoggedIn().then((result) => {
            if (result) {
                this.navCtrl.push(TabsPage).then(() => {
                    this.storage.set('hasSeenTutorial', 'true');
                });
            } else {
                this.navCtrl.push(LoginPage).then(() => {
                    this.storage.set('hasSeenTutorial', 'true');
                });
            }
        });
    }

    onSlideChangeStart(slider:Slides) {
        this.showSkip = !slider.isEnd();
    }

    ionViewWillEnter() {
        this.slides.update();
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewDidLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }

}
