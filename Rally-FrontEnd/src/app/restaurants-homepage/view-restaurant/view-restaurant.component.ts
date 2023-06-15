import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReviewDTO } from '../models/ReviewDTO';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';

@Component({
  selector: 'app-view-restaurant',
  templateUrl: './view-restaurant.component.html',
  styleUrls: ['./view-restaurant.component.css']
})
export class ViewRestaurantComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  currentUser; 
  restaurantId;
  restaurant;
  reviewRestaurant;
  loadingBoolean: boolean;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService) {
    this.restaurantId = +this.route.snapshot.paramMap.get('id');
    this.loadingBoolean = true;
}


  ngOnInit(): void {
    if (this.authorize.isloggedIn() === true) {
      
      /* Get all information relevent to user */
      this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
      .subscribe((data: any) => {
        this.currentUser = data.viewUser.userName
        this.loadingBoolean = false;
      },  err => {
        if (err.status === 500) {
          this.authorize.logOut();
          this.currentUser = null;
          this.router.navigate(['/login'])
        }
      })
    
    }
    else {
      this.router.navigate(['/login'])
    }
    this.http.get(this.hostUrl + "/viewRestaurant/" + this.restaurantId).subscribe((response) => {
  console.log(response);
  this.restaurant = response;
  })

  this.http.get( this.hostUrl + "/restaurantReviews/" + this.restaurantId).subscribe((response) => {
    console.log(response);
    this.reviewRestaurant = response;
  // console.log(this.reviewRestaurant)
    })
}

  submit(review: NgForm) {
    console.log("form submitted", review)
    let reviewDetails: ReviewDTO = {description: review.value.userReview, name: this.currentUser, restaurantId: this.restaurantId}
    console.log(reviewDetails);
    this.http.post( this.hostUrl + "/reviews", reviewDetails).subscribe((res) => {
      location.reload();
    })
  }
  logOut() {
    this.authorize.logOut()
  }

}


