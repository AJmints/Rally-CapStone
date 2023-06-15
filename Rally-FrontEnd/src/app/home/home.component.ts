import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeserviceService } from '../services/themeservice.service';
import { ViewUserService } from '../user-profile-arm/user-profile/services/view-user.service';
import { AuthorizeService } from '../security/security-service/authorize.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logInStatus: boolean;
  loginLoading: boolean;
  currentUser: string;
  constructor(private router: Router, private themeservice: ThemeserviceService, private activeUserService: ViewUserService, private authorize: AuthorizeService) { 
    this.logInStatus = false;
    this.loginLoading = true;
  }
  

  ngOnInit(): void {

    if (this.authorize.isloggedIn() === true) {
      
      /* Get all information relevent to user */
      this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
      .subscribe((data: any) => {
        this.logInStatus = true;
        this.currentUser = data.viewUser.userName
        this.loginLoading = false;
      },  err => {
        if (err.status === 500) {
          this.logInStatus = false;
          this.currentUser = null;
          this.themeservice.logOut();
          this.loginLoading = false;
        }
      })
  }
    else {
      this.themeservice.logOut();
      this.logInStatus = false;
      this.loginLoading = false;
  }
  }
  redirectToLogIn(){
    this.router.navigate(["/login"]);
  }
  logOut() {
   
    this.themeservice.logOut();
    this.logInStatus = false;
  }
}
