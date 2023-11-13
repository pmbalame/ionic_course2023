import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Place } from '../../places/place.model';
import {NgForm} from '@angular/forms'

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place| any;
  @Input() selectedMode: 'select'| 'random'  = 'select';
  @ViewChild('f', { static: true}) form: NgForm | any;
  startDate: string | any;
  endDate: string | any;
  date: Date = new Date();
  Date: Date = new Date();

  constructor(private modalCtrl: ModalController) {
    const dateString = "2023-09-14T10:00:00Z"; // Sample date string in ISO format
    const date = new Date(dateString);
    this.startDate = date;
    this.endDate = date;
  }

  ngOnInit() {

    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    this.startDate = availableFrom;
    this.endDate = availableTo;
    //console.log(this.selectedPlace.availableFrom)
    //console.log(this.selectedPlace.availableTo)
    // CONVERTING DATE
    if (this.selectedMode === 'random'){
      this.startDate =
      new Date( availableFrom.getTime() +
      Math.random() *
        (availableTo.getTime() -
         7 * 24 * 60 * 60* 1000 -
           availableFrom.getTime())
           ).toISOString();
           this.endDate = new Date(
           new Date(this.startDate).getTime() +
            Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
              ).toISOString();
    }
    console.log('Date:', availableFrom);
    console.log('Date:', availableTo);
    //console.log(this.startDate);
    //console.log(this.endDate);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    if(!this.form.valid || !this.datesValid()){
      return;
    }
    this.modalCtrl.dismiss({
      firstName: this.form.value['first-name'],
      lastName: this.form.value['last-name'],
      idNumber: +this.form.value['id-number'],
      guestNumber: +this.form.value['guest-number'],
      startDate: new Date(this.form.value['date-from']),
      endDate: new Date (this.form.value['date-to'])
     }, 'confirm');
  }
  datesValid(){
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
