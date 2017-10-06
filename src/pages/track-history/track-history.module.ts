import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackHistoryPage } from './track-history';

@NgModule({
  declarations: [
    TrackHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackHistoryPage),
  ],
  entryComponents: [
    TrackHistoryPage,
  ]
})
export class TrackHistoryPageModule {}
