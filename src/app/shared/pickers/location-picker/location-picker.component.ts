import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates, PlaceLocation } from '../../../../app/places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string | any;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCrtl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCrtl.create({
      header: 'Please choose',
      buttons: [
        { text: 'Auto-Locate', handler: () => { this.locateUser(); } },
        { text: 'Pick on Map', handler: () => { this.openMap(); } },
        { text: 'Cancel', role: 'cancel' }
      ]
    }).then(el => el.present());
  }

  private locateUser() {
    this.isLoading = true;
    Geolocation.getCurrentPosition().then((geoPosition: any) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.createPlace(coordinates.lat, coordinates.lng);
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(el => el.present());
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) { return; }
        this.createPlace(modalData.data.lat, modalData.data.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = { lat, lng, address: ' ', staticMapImageUrl: ' ' };
    this.isLoading = true;
    this.getAddress(lat, lng).pipe(
      switchMap((address: any) => {
        pickedLocation.address = address;
        return of(this.getMapImage(lat, lng, 14));
      })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
    ).pipe(map((geoData: any) => {
      if (!geoData || !geoData.results || geoData.results.length === 0) { return null; }
      return geoData.results[0]?.formatted_address || null;
    }));
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }
}
