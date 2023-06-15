import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-services-home',
  templateUrl: './services-home.component.html',
  styleUrls: ['./services-home.component.css']
})
export class ServicesHomeComponent implements OnInit {
  currentUser;
  logInStatus: Boolean;

  constructor(private authorize: AuthorizeService,private http: HttpClient, private router: Router) {
    this.logInStatus = false;
   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
  }

  verifyLoggedIn() {

    if (localStorage.getItem('userName') != null) {
      this.currentUser = localStorage.getItem('userName');
      this.logInStatus = true;
    }
  
  }

  logOut() {
    this.authorize.logOut()
  }

}
