import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.css']
})
export class ViewallComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  restaurantList: Restaurant[];
  private getRestaurantListUrl: string = this.hostUrl + '/restaurantList'
  constructor(private http:HttpClient, private router: Router,  private authorize: AuthorizeService,) { }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }

    this.http.get(this.getRestaurantListUrl).subscribe((response: Restaurant[]) => {
      console.log(response);
      this.restaurantList = response;
      console.log(this.restaurantList)
    })
  }
  logOut() {
    this.authorize.logOut()
  }

}
