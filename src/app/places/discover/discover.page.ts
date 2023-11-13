import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail, SegmentCustomEvent } from '@ionic/angular';
import { Subscription} from 'rxjs';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = [];
  isLoading = false;
  filter = 'all';
  relevantPlaces: Place[]=[];
  private placesSub: Subscription | any;



  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
    ){ }

  // ngOnInit() {
  //   this.placesSub = this.placesService.places.subscribe(places => {
  //     this.loadedPlaces = places;
  //     this.onFilterUpdate(this.filter);
  //    });

  //   console.log(this.relevantPlaces)

  // }
  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }


  onOpenMenu() {
    this.menuCtrl.toggle();
  }
 setPlace(title:any, description: any, imageUrl: any){
    window.sessionStorage.setItem('locationTitle',title);
    window.sessionStorage.setItem('locationDescription',description);
    window.sessionStorage.setItem('locationImage', imageUrl);
  }

  onFilterUpdate(filter: string){
  const isShown = (place: any) => filter === 'all' || place.userId !== this.authService.userId;
  this.relevantPlaces = this.loadedPlaces.filter(isShown);
  this.filter = filter;
  console.log(filter)
 }
    // onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    //   if (event.detail.value === 'all') {
    //     this.relevantPlaces = this.loadedPlaces;
    //     this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    //   } else {
    //     this.relevantPlaces = this.loadedPlaces.filter(
    //       place => place.userId !== this.authService.userId
    //     );
    //     this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    //   }
    // }
  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    if(this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

}
