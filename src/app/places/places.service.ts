import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { take, map, tap, delay, switchMap} from 'rxjs/operators';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

// [
//   new Place(
//     'p1',
//     'Thamole Lodge',
//     'Fernão Veloso Beach - Nacala City, Nampula',
//     'https://upload.wikimedia.org/wikipedia/commons/d/d4/Bungalow_N%C2%B02_-_panoramio.jpg',
//     149.99,
//     new Date('2023-08-23'),
//     new Date('2023-08-31'),
//     'xyz'
//   ),
//   new Place(
//     'p2',
//     'Zalala Beach Lodge',
//     'Zalala Beach - Quelimane City, Zambézia',
//     'https://images.trvl-media.com/lodging/46000000/45710000/45703600/45703551/01c707ac.jpg?impolicy=resizecrop&rw=598&ra=fit',
//     149.99,
//     new Date('2023-08-23'),
//     new Date('2023-08-31'),
//     'abc'
//   ),
//   new Place (
//     'p3',
//     'Residencial Maria Lúcia',
//     'Mopeia Village - Mopeia District, Zambézia',
//     ' https://images.trvl-media.com/lodging/46000000/45710000/45703600/45703551/01c707ac.jpg?impolicy=resizecrop&rw=598&ra=fit',
//     100.99,
//     new Date('2023-08-23'),
//     new Date('2023-08-31'),
//     'abc'
//   )
// ]

interface PlaceData {
availableFrom: Date;
availableTo: Date;
description: string;
imageUrl: string;
price: number;
title: string;
userId: string;
}
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places =  new BehaviorSubject<Place[]>([]) ;

  get places()  {
    return this._places.asObservable();
  }

  fetchPlaces(){
    return this.http
    .get<{[key: string] : PlaceData}>('https://ionic-angular-course-fc889-default-rtdb.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          places.push(
            new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId,
              )
            );
        }

      }
     return places;
      // return [];

    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }

  constructor( private authService: AuthService, private http: HttpClient) { }
  getPlace(id: string){
    return this.places.pipe(
      take(1),
      map(places => {
        return {...places.find(p => p.id === id) };
    })
    );
  }
  addPlace
  (
    id: string,
    title: string,
    description: string,
    price: number,
    dateFrom:Date,
    dateTo: Date
  )
  {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/d/d4/Bungalow_N%C2%B02_-_panoramio.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
      );
      return this.http
      .post<{ name: string }>('https://ionic-angular-course-fc889-default-rtdb.firebaseio.com/offered-places.json',
      {
        ...newPlace,
        id: null
      }
      )
      .pipe(
        switchMap(resDate => {
          generatedId = resDate.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
            })
      );
    //  return  this.places.pipe(take(1), delay(1000), tap( places => {

    //       this._places.next(places.concat(newPlace));
    //     })
        // );
  }
  updatePlace(placeId: string, title: string, description: string){
      let updatedPlaces: Place[];
      return this.places.pipe(
      take(1),
      switchMap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course-fc889-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id:null}
          );
      }),
      tap(() => {
        this._places.next(updatedPlaces);

      })
     );
  }
}


