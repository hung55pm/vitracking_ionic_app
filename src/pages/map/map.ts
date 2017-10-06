import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform, NavController, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { TrackHistoryPage } from '../track-history/track-history';
import { DevDataProvider } from '../../providers/dev-data';
import { UserData } from '../../providers/user-data';

//import { GoogleMap, GoogleMapsEvent, LatLng } from '@ionic-native/google-maps';


import 'rxjs/add/operator/map';

declare var google:any;


@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {
    trackHistory:any;
    loading: any;
    devList: any = [];
    currentDev: any;
    locations: any[] = [];
    markers: any = {};

    map: any;


    @ViewChild('mapCanvas') mapElement:ElementRef;
    //@ViewChild('fab') fabCtrl:FabButton;

    constructor(
        public navCtrl:NavController,
        private loadingCtrl: LoadingController,
        public confData:ConferenceData,
        public platform:Platform,
        public api:ApiProvider,
        public devData: DevDataProvider,
        public userData: UserData
    ) {
        this.loading = this.loadingCtrl.create({content: 'Loading...' });
        this.trackHistory = TrackHistoryPage;

        //platform.ready().then(() => {
        //    this.loadMap();
        //});


    }

    //loadMap(){
    //
    //    let location = new LatLng(21.0138616,105.8112353);
    //
    //    this.map = new GoogleMap('map_canvas', {
    //        'controls': {
    //            'compass': true,
    //            'myLocationButton': true,
    //            'indoorPicker': true,
    //            'zoom': true
    //        },
    //        'gestures': {
    //            'scroll': true,
    //            'tilt': true,
    //            'rotate': true,
    //            'zoom': true
    //        },
    //        'camera': {
    //            'target': location,
    //            'tilt': 30,
    //            'zoom': 15,
    //            'bearing': 50
    //        }
    //    });
    //
    //    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
    //        console.log('Map is ready!');
    //    });
    //
    //}


    ionViewDidLoad() {
        //this.loading.present();

        let mapElement = this.mapElement.nativeElement;
        let map = new google.maps.Map(
            mapElement,
            {
                center: {lat: 21.0138616, lng: 105.8112353},
                zoom: 16,
                zoomControl: false,
                streetViewControl: false
            }
        );
        google.maps.event.addListenerOnce(map, 'idle', () => {
            mapElement.classList.add('show-map');
        });
        this.map = map;

        this.updateDevList();
    }

    updateDevList() {
        this.devData.getDevList().subscribe( devList => {
            this.devList = [];
            for(var id in devList) {
                this.devList.push(devList[id]);
            }
            //this.currentDev = this.devData.currentDev();
            this.switchDevice(this.userData.currentDev(), null);
        });
    }

    switchDevice(pid:string, fab: any) {
        console.log('SWITCH TO DEVICE: ', pid);
        this.userData.setCurrentDev(pid);
        this.currentDev = this.devData.currentDev();
        if(fab) fab.close();
        this.updateLocation(pid);
    }

    updateLocation(pid:string) {
        this.devData.getLocations([pid]).subscribe( (locations:any[]) => {
            // loop through received location and draw on map
            locations.forEach(loc => {
               if(loc.data) {
                   var marker = this.markers[loc.pid];
                   if(marker) {
                       // marker already exist => move to new location
                       marker.position = {lat: loc.data.latitude, lng: loc.data.longitude};
                   } else {
                       // marker doesn't exist => create new
                       marker = new google.maps.Marker({
                           map: this.map,
                           position: {lat: loc.data.latitude, lng: loc.data.longitude}
                       });
                       this.markers[loc.pid] = marker;
                   }
               };
            });
            // remove un-used markers
            var unusedMarkers: string[] = []
            for(var pid in this.markers) {
                var exists = locations.find(item => {return item.pid==pid});
                if (!exists) unusedMarkers.push(pid);
            }
            unusedMarkers.forEach(id => {
                this.markers[id].map = null;
                delete this.markers[id]
            });
            // focus camera
            if(this.currentDev) this.focusCamera(this.currentDev.id);
        });
    }

    focusCamera(pid:string) {
        var marker = this.markers[pid];
        console.log(marker);
        if(marker) {
            this.map.panTo(marker.position);
        }
    }

    openTrackHistory() {
        this.navCtrl.push(this.trackHistory);
    }
}
