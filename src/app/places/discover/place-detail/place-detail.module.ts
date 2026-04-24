import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';
import { PlaceDetailPage } from './place-detail.page';
import { ShareModule } from '../../../../app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    ShareModule

  ],
  declarations: [PlaceDetailPage]
})
export class PlaceDetailPageModule {}
