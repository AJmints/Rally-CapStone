import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../security-service/authorize.service';
import { LoginDTO } from 'src/app/user-profile-arm/models/dto/LoginDTO';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  private hostUrl = 'http://localhost:8080';

  tokenId: string;
  logInStatus = false;
  verificationResponse: string;

  constructor(private route: ActivatedRoute, 
              private http: HttpClient,
              private router: Router,
              private authorize: AuthorizeService) {
   }

  ngOnInit(): void {

    if (this.authorize.isloggedIn()) {
      this.logInStatus = true;
    }

    /* Pull verification token from active url */
    this.route.paramMap.subscribe(params => {
      this.tokenId = params.get('token');
    });
    
    /* Send the token to the back to get verified  */
    this.http.post( this.hostUrl + '/api/confirm-account', this.tokenId).subscribe((response: any) => {

    /* Failed */
      if (response.message === 'Token not present') {
        this.verificationResponse = "Token expired, being rerouted to login in 5 seconds."
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 5000);
      }
    /* Success */
      if (response.success) {
      this.verificationResponse = response.success;
      } else if (response.message === "Error: Couldn't verify email.") {
        this.verificationResponse = response.message;
      } 
    })
  }

  logOut() {
    this.authorize.logOut();
  }

  redirectToLogIn(){
    this.router.navigate(["/login"]);
  }

}
