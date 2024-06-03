import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place | any;
  placeId: string| any;
  form: FormGroup | any;
  isLoading = false;
  private placeSub: Subscription | any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      const placeId = paramMap.get('placeId')+''
      this.placeSub = this.placesService
      .getPlace(placeId)
      .subscribe(place =>{
        this.place = place;
      this.form = new FormGroup ({
        title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        })
      });
      this.isLoading = false;
      },
      error => {
        this.alertCtrl.create({
          header: 'An error occurred!',
          message: 'Place could not be fetched. please try again later.',
          buttons: [{text:'Okay', handler: ()=> {
            this.router.navigate(['/places/tabs/offers'])
          }
        }
      ]
    })
    .then(alertEl => {
      alertEl.present();
    });

      }
      );
    });

  }
  onUpdateOffer(){
    if (!this.form.valid){
      return;
    }
    this.loadingCtrl.
    create({
      message: 'Updating place...'
    })
    .then(loadingEl =>{
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
        ).subscribe(() =>{
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers'])
        });
    });
  }
  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

}
