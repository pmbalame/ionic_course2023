export class CreateBooking {
  constructor(
    public id: string,
    public guestId: string,
    public firstName: string,
    public lastName: string,
    public guestNumber: number,
    public idNumber: number,
    public startDate: Date,
    public endDate: Date
  ) {}
}
