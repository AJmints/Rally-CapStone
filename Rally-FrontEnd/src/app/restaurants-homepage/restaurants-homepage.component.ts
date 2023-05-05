import { Component, OnInit } from '@angular/core';
import { Restaurant } from './models/Restaurant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-restaurants-homepage',
  templateUrl: './restaurants-homepage.component.html',
  styleUrls: ['./restaurants-homepage.component.css']
})
export class RestaurantsHomepageComponent implements OnInit {

  restaurantList: Restaurant[];
  private getRestaurantListUrl: string = 'http://localhost:8080/restaurant/restaurantList'
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.getRestaurantListUrl).subscribe((response: Restaurant[]) => {
      console.log(response);
      this.restaurantList = response;
      console.log(this.restaurantList)
    })
  }
}
