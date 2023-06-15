import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  constructor( private router: Router,  private authorize: AuthorizeService,) { }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
    // login(userInformation: NgForm ) {

    // }

  }

  submit(review) {
    console.log("form submitted", review)
  }
  logOut() {
    this.authorize.logOut()
  }

}
