import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-restaurant-american',
  templateUrl: './restaurant-american.component.html',
  styleUrls: ['./restaurant-american.component.css']
})
export class RestaurantAmericanComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  americanRestaurant: Restaurant[] = [];
  
  restaurantList: Restaurant[];
  private getRestaurantListUrl: string = this.hostUrl + '/restaurantList'
  
  constructor(private http:HttpClient, private router: Router,  private authorize: AuthorizeService,) { }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }

    this.http.get(this.getRestaurantListUrl).subscribe((response: Restaurant[]) => {
      this.restaurantList = response;
      console.log(this.restaurantList)



      for(let i = 0;i< this.restaurantList.length;i ++) {
        if(this.restaurantList[i].restaurantType === "American" || this.restaurantList[i].restaurantType === "american") {

            this.americanRestaurant.push(this.restaurantList[i])
        }
      }
    })
  }
  logOut() {
    this.authorize.logOut()
  }

}
