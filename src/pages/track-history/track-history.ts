import { Component,ViewChild, ElementRef,Renderer2  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


//import { ModalController, Popup } from 'ionic-angular';



declare var google:any;

/**
 * Generated class for the TrackHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-track-history',
  templateUrl: 'track-history.html'
})
export class TrackHistoryPage {
	@ViewChild('mapCanvas') mapElement:ElementRef;
	@ViewChild('ctrlPane') ctrlPane:ElementRef;

	loading: any;
	today: any;
  collapsed: boolean;

  constructor(
  	private alertCtrl: AlertController,
  	private loadingCtrl: LoadingController,
  	private toastCtrl: ToastController,
  	//private modalCtrl: ModalController,
  	public navCtrl: NavController,
   public navParams: NavParams, 
   public api:ApiProvider,
   public renderer: Renderer2
   ) {
   	this.loading = this.loadingCtrl.create({
    	content: 'Please wait...'
  	});
  	this.today = new Date().toISOString();
    this.collapsed=false;
  }

  ionViewDidLoad() {
    let mapElement = this.mapElement.nativeElement;
    let map = new google.maps.Map(
        mapElement,
        {
            center: {lat: 21.0138616, lng: 105.8112353},
            zoom: 16,
            zoomControl: false,
            streetViewControl:false
        }
    );
    google.maps.event.addListenerOnce(map, 'idle', () => {
        mapElement.classList.add('show-map');
    });

    
  	this.loading.present();


    this.api.trackHistory('c9f00006', '2017-10-05T00:00:00', '2017-10-05T23:59:00').then(positionList => {
       for(var i in positionList){
       		var p = positionList[i];
           new google.maps.Marker({
           		map: map,
           		position: {lat: p['latitude'], lng: p['longitude']}
           });
       }
       this.loading.dismiss();
    });

  }

  deleteHistory() {
  	let alert = this.alertCtrl.create({
  		title: 'Confirm delete',
  		message: 'Are you sure delete all?',
  		buttons: [
  			{text: 'Cancel', role: 'cancel'},
  			{text: 'OK', handler: () => {
  				let toast = this.toastCtrl.create({
  					message: 'All history deleted!',
  					duration: 3000
  				});
  				toast.present();
  			}},
  		]
  	});
  	alert.present();
  }
  showSearch() {
    if(this.collapsed) {
      this.renderer.removeClass(this.ctrlPane.nativeElement,'goDown');
      this.renderer.addClass(this.ctrlPane.nativeElement,'goUp');
    } else {
      this.renderer.addClass(this.ctrlPane.nativeElement,'goDown');
      this.renderer.removeClass(this.ctrlPane.nativeElement,'goUp');
    }
  	this.collapsed = !this.collapsed;
  }
}
