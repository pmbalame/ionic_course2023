import { Injectable } from "@angular/core";
import { CreateBooking } from "./create-booking.model";
import { BehaviorSubject } from "rxjs";
import {delay, switchMap, take, tap, map} from"rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../../app/auth/auth.service";

interface CreateBookingData {
    guestId: string,
    firstName: string,
    lastName: string,
    idNumber: number,
    guestNumber: number,
    startDate: Date,
    endDate: Date,
    userId: string

}

@Injectable({  providedIn: 'root'})
export class CreateBookingService {
  private _createbooking = new BehaviorSubject<CreateBooking[]>([]);
  get createbooking() {
    return this._createbooking.asObservable();
  }
  constructor(private authService: AuthService, private http:HttpClient) {

  }
  addCreateBooking(
    guestId: string,
    firstName: string,
    lastName: string,
    idNumber: number,
    guestNumber: number,
    startDate: Date,
    endDate: Date


    ){
      let generatedId: string;
      const newCreateBooking = new CreateBooking(
        Math.random().toString(),
        guestId,
        firstName,
        lastName,
        idNumber,
        guestNumber,
        startDate,
        endDate
        );
        return this.http
        .post<{name: string}>(`https://ioniccourse2023-default-rtdb.firebaseio.com/createbooking.json?auth=${token}`,
         {...newCreateBooking, id: null}
         ).pipe(switchMap(resData => {
            generatedId = resData.name;
            return this.createbooking;

         }),
         take(1),
         tap(createbooking => {
          newCreateBooking.id = generatedId;
          this._createbooking.next(createbooking.concat(newCreateBooking));
          console.log(createbooking)
         })
         );
    }
    cancelCreateBooking(createbookingId: string){
      return this.http.delete(
        `https://ioniccourse2023-default-rtdb.firebaseio.com/createbooking/${createbookingId}.json`
        ).pipe(switchMap(() => {
          return this.createbooking;
        }), take(1),
         tap(createbooking => {
          this._createbooking.next(createbooking.filter( b => b.id !== createbookingId));
        }));
      }

      fetchBookings() {
        return this.http.get<{[key: string]: CreateBookingData}>(
          `https://ioniccourse2023-default-rtdb.firebaseio.com/createbooking.json?orderBy="userId"&equalTo="${
            this.authService.userId
          }"`
        )
        .pipe(
          map(createbookingData => {
          const createbooking = [];
          for ( const key in createbookingData){
            if(createbookingData.hasOwnProperty(key)){
              createbooking.push(
                new CreateBooking(
                  key,
                  createbookingData[key].userId,
                  createbookingData[key].firstName,
                  createbookingData[key].lastName,
                  createbookingData[key].idNumber,
                  createbookingData[key].guestNumber,
                  new Date( createbookingData[key].startDate),
                  new Date( createbookingData[key].endDate)
                  )
                 );
                }
             }
             return createbooking;
            }),
            tap(createbooking => {
              this._createbooking.next(createbooking);
              console.log(createbooking)
            })
        );
      }
}

