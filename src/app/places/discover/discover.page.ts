import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { take} from 'rxjs/operators';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[]= [];
  relevantPlaces: Place[]=[];
  filter = 'all';
  isLoading = false;
  private placesSub = new Subscription();

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;  // Show loading spinner
    this.placesSub = this.placesService.places.subscribe(
      places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      this.isLoading = false; // Hide loading spinner after data loads
    },
    error => {
      console.log("Error fetching places:", error);
      this.isLoading = false;
    });
  }

 /* ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }
    */

  ionViewWillEnter() {
    this.isLoading = true;
  let fetchedUserId: string | null = null;

  this.authService.userId.pipe(take(1)).subscribe(userId => {
    fetchedUserId = userId; // Extract the actual userId value

    this.placesService.fetchPlaces().subscribe(
      places => {
        console.log("Fetched places: ", places);
        this.loadedPlaces = places;

        // Apply the filter correctly
        this.relevantPlaces = this.filter === 'all' ? this.loadedPlaces : this.loadedPlaces.filter(
          place => place.userId !== fetchedUserId
        );
        this.isLoading = false;
      },
      error => {
        console.log("Error fetching places: ", error);
        this.isLoading = false;
      }
    );
  });
    setTimeout(() => {
      document.querySelectorAll("[aria-hidden='true']").forEach(el => el.removeAttribute("aria-hidden"));
    }, 500);
  }


  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
     this.filter  = event.detail.value as string; // Store selected filter

  this.authService.userId.pipe(take(1)).subscribe(userId => {
    if (!this.loadedPlaces.length) return; // Ensure data is loaded before filtering

    if (this.filter === 'all') {
      this.relevantPlaces = [...this.loadedPlaces];
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
    }
    this.listedLoadedPlaces = this.relevantPlaces.slice(1);
  });
  }
  setPlace(title: string, description: string, imageUrl: string) {
    console.log('Place set:', title, description, imageUrl);
    // Add your logic here
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
