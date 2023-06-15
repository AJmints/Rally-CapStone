export class addRestaurant {
    restauntName: string;
    address: string;
    conactInfo: string;
    neighborhood: string;
   restaurantType: string;

   constructor(restauntName: string, address: string, conactInfo: string, neighborhood: string, restaurantType: string) {
    this.restauntName= restauntName;
    this.address = address;
    this.conactInfo = conactInfo;
    this.neighborhood = neighborhood;
    this.restaurantType = restaurantType;
   }

}