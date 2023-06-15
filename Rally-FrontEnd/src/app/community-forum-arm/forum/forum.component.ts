import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { StorageService } from 'src/app/security/security-service/storage-service.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

private hostUrl = 'http://localhost:8080'
currentUser: string;
logInStatus: boolean;
darktheme: boolean;
loginLoading: boolean;
userProfilePics: any[] = [];
dbImage: any;
postResponse: any;
constructor(private http: HttpClient, private router: Router, private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private storageService: StorageService,) {
  this.logInStatus = false;
  this.darktheme = false;
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

this.http.get( this.hostUrl + '/user/userProfileImage/' + this.themeservice.getUserName()).subscribe((response: any) => {
  if (response.message) {
    return;
  } else {
    this.postResponse = response;
    this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
  }
})

  this.checkTheme();
}
checkTheme(){
    if (localStorage.getItem('theme') == 'dark'){
        this.Dark();
    }
    else {
      this.Light();
    }
}

Light(){
    this.darktheme = false;
    localStorage.setItem('theme', 'light')
}
Dark(){
  this.darktheme = true;
  localStorage.setItem('theme', 'dark')
}
logOut() {
  this.logInStatus = false;
  this.themeservice.logOut();
}
async Search(searchInformation: NgForm){
  localStorage.setItem('searchTerm', searchInformation.value.description)
  this.router.navigate(["/forum/search"]);
}

redirectToLogIn(){
  this.router.navigate(["/login"]);
}
}
