import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-restaurants-pizza',
  templateUrl: './restaurants-pizza.component.html',
  styleUrls: ['./restaurants-pizza.component.css']
})
export class RestaurantsPizzaComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  pizzaRestaurant: Restaurant[] = [];
  
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
        if(this.restaurantList[i].restaurantType === "Pizza" || this.restaurantList[i].restaurantType === "pizza") {
            this.pizzaRestaurant.push(this.restaurantList[i])
        }
      }
    })
  }
  logOut() {
    this.authorize.logOut()
  }

}
