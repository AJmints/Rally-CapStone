import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

const AUTH_API = 'http://localhost:8080/verify/'

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private router: Router,
              private cookieService: CookieService,
              private http: HttpClient) { }

  
  /* Returns a boolean based on if the token is expired (true) or not expired (false) */
  isloggedIn(): any {
    
    if (!this.cookieService.check('token')) {
      return false;
    } else {
      let tokenInfo: any = this.cookieService.get('token')

    /* If JWT throws any error due to tampering, log out user */
    try {
      JSON.parse(atob(tokenInfo.split(".")[1]))
    } catch(e) {
      this.logOut();
      return;
    }
      
    const payload = atob(tokenInfo.split(".")[1])
    const parsedPayload = JSON.parse(payload)

    /* if the JWT token is still valid, return true, else false */
    return parsedPayload.exp > Date.now() / 1000;
    }
  }

  /* When logging out, post the JWT token to the block list so it can't be used again */
  logOut() {
    localStorage.removeItem('userName');
    localStorage.removeItem('id');
    this.cookieService.delete('token');
    this.router.navigate(["/login"])
    return false;
  }

}
