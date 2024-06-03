import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBookingComponent } from './create-booking.component';



@NgModule({
  declarations: [ CreateBookingComponent],
  imports: [
    CommonModule,
    CreateBookingModule,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class CreateBookingModule { }
