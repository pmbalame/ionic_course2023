import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http'; // ✅ Import HttpClient
import { take, switchMap } from 'rxjs/operators';
import { Place } from '../../places/place.model';
import {NgForm} from '@angular/forms'
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {

  onDatetimeChange(event: Event) {
    // Access the selected datetime through event.detail.value
    console.log('Selected Date and Time:', event);

    // If you want to store it in a variable
    //this.selectedDate = event.detail.value;
  }

  @Input() selectedPlace: Place| any;
  @Input() selectedMode: 'select'| 'random'  = 'select';
  @ViewChild('f', { static: true}) form: NgForm | any;
  @ViewChild('datetimeFromModal', { static: false }) datetimeFromModal!: IonModal;
  @ViewChild('datetimeToModal', { static: false }) datetimeToModal!: IonModal;

  startDate: string | any;
  endDate: string | any;
  date: Date = new Date();
  Date: Date = new Date();
  /*d1:any;
  d2:any;
*/
  d1: string = new Date().toISOString();  // Initializes with current date in ISO format
  d2: string = new Date().toISOString();  // Initializes with current date in ISO format

 /*d1: string = '';
  d2: string = '';
*/
  dateFrom: string = '';  // Add this
  dateTo: string = '';    // Add this
  guestNumber: number = 1;  // ✅ Add this property


  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private authService: AuthService  ) {
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

    // Initialize dateFrom and dateTo to prevent undefined values
    this.dateFrom = availableFrom.toISOString();
    this.dateTo = availableTo.toISOString();
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
      console.log("❌ Form is invalid!",this.form.value)

      return ;
    }
     // Create booking data object
  const bookingData = {
    firstName: this.form.value['first-name'],
    lastName: this.form.value['last-name'],
    idNumber: +this.form.value['id-number'],
    guestNumber: +this.form.value['guest-number'],
    startDate: new Date(this.form.value['dateFrom']).toISOString(),
    endDate: new Date(this.form.value['dateTo']).toISOString()
  };

  console.log("📤 Submitting Data to Firebase:", bookingData);

  // ✅ Use switchMap to get the token before making the HTTP request
  this.authService.token.pipe(
    take(1),
    switchMap(token => {
      const firebaseUrl = `https://ioniccourse2023-default-rtdb.firebaseio.com/bookingDate.json?auth=${token}`;
      return this.http.post<{ name: string }>(firebaseUrl, bookingData);
    })
  ).subscribe(
    response => {
      console.log("✅ Booking successfully saved in Firebase RTDB!", response);
      this.modalCtrl.dismiss(null, 'confirm'); // Close modal after saving
    },
    error => {
      console.error("❌ Error saving booking:", error);
    }
  );
}
  // Validate dates
  datesValid(){
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);
    return endDate > startDate;
  }

  /* onDateSelected(event: any, field: string) {
    const selectedDate = event.detail.value;
    console.log('Selected Date:', selectedDate);

    if (field === 'd1') {
      this.d1 = selectedDate;
      if (this.datetimeFromModal) {
        this.datetimeFromModal.dismiss(); // Close modal
      }
    } else if (field === 'd2') {
      this.d2 = selectedDate;
      if (this.datetimeToModal) {
        this.datetimeToModal.dismiss(); // Close modal
      }
    }
  }

  closeCalendar(modalId: string) {
    const modal = document.getElementById(modalId) as any;
    if (modal) {
      modal.dismiss();
    }
  }
    */

  async onDateSelected(event: any, field: string) {
    const selectedDate = event.detail.value;
    console.log('Selected Date:', selectedDate);

    if (field === 'd1') {
      this.d1 = selectedDate;
    } else if (field === 'd2') {
      this.d2 = selectedDate;
    }

    // Close the modal after date selection
    await this.closeCalendar();
  }

  async closeCalendar() {
    const activeModal = await this.modalCtrl.getTop();
    if (activeModal) {
      await activeModal.dismiss();
    }
  }



}
