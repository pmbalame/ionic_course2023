export class Place {
  constructor(
    public id: string | any,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string
    ) {}
}
