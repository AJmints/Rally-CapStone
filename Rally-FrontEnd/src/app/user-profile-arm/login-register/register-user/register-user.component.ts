import { Component, OnInit } from '@angular/core';
import { RegisterDTO } from '../../models/dto/RegisterDTO';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoDTO } from '../../models/dto/UserInfoDTO';
import { UserBundleDTO } from '../../models/dto/UserBundleDTO';
import { LogRegService } from '../service/log-reg.service';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  /* Host Url */
  private hostUrl = 'http://localhost:8080';

  /* Temp container for register forms */
  registerUser: RegisterDTO;

  /* Error Messages */
  userInformationCheck: any[] = [];

  /* Booleans for HTML form change and Error display */
  nextFormInfo: boolean = true;
  noErrorInFormSubmit: boolean;

  /* Form Error handling/messaging */
  noUserNameError: boolean;
  errorUserName: string;
  noUserEmailError: boolean;
  errorUserEmail: string;
  whiteSpaceError: boolean;
  illegalWhiteSpace: string;
  passwordForm: boolean;
  errorPassword: string;
  passwordMatchIssue: boolean;
  passWordsDontMatch: string;
  userNameOrEmailTaken: boolean;
  alreadyInUse: string;
  noFirstNameError: boolean;
  firstNameMessage: string;
  noLastNameError: boolean;
  lastNameMessage: string;
  createNewUser: boolean;
  postResponseMessage: string;
  postResponseMessageValid: string;
  emailVerifyLoading: boolean = false;

  constructor(private http: HttpClient, 
              private router: Router,
              private reglogService: LogRegService,
              private authorize: AuthorizeService) {
   }

  ngOnInit(): void {
    /* if the user is logged in, redirect to profile */
    if (this.authorize.isloggedIn()) {
      this.router.navigate(["/myProfile"]);
    }
  } 

  /* Clear all error messages on register page */
  clearForms() {
    this.userInformationCheck = [];
    this.errorUserName = "";
    this.errorUserEmail = "";
    this.errorPassword = "";
    this.passWordsDontMatch = "";
    this.firstNameMessage = "";
    this.lastNameMessage = "";
    this.postResponseMessage = "";
    this.registerUser = null;
    this.nextFormInfo = true;
  }

  /* This checks the first registration form that all info is entered correctly */
  /* Checks that the userName and email are avaialable */
  registerNewUser(userInformation: NgForm) {
    this.errorUserName = "";
    this.errorUserEmail = "";
    this.errorPassword = "";
    this.passWordsDontMatch = "";

    let submitNewUser: RegisterDTO = {
      userName: userInformation.value.userName,
      userEmail: userInformation.value.userEmail,
      password: userInformation.value.password,
      verifyPassword: userInformation.value.verify
    }
    if (this.reglogService.blankSpaceDetect(submitNewUser)) {
      this.illegalWhiteSpace = "Blank spaces are not allowed";
      this.nextFormInfo = true;
      return;
    }

    /* Get error info in form if any */
    let response: any[] = this.reglogService.checkUserInformation(submitNewUser);

    /* Get the errors, store in variables, and pass into html to display to the user */
    if (response.length === 0) {
      this.registerUser = submitNewUser;
    } else {
      for (let i = 0; i < response.length; i++) {
        if (response[i].message === 1) {
          this.errorUserName = response[i].contents;
        }
        if (response[i].message === 2) {
          this.errorUserEmail = response[i].contents;
        }
        if (response[i].message === 3) {
          this.errorPassword = response[i].contents;
        }
        if (response[i].message === 4) {
          this.passWordsDontMatch = response[i].contents;
        }
      }
      return;
    }

    /* Check to be sure userName or Email aren't taken */
    this.http.post( this.hostUrl +'/api/nameEmailCheck', submitNewUser).subscribe((response: any) => {
      if (response.message !== 'True') {
        this.alreadyInUse = response.message;
        this.nextFormInfo = true;
        return
      } else {
        this.nextFormInfo = false;
        return;
      }
    })


  }

  /* Get user information */
  completeRegisteration(userDetails: NgForm) {
    this.userInformationCheck = [];

    let userInfo: UserInfoDTO = {
      firstName: userDetails.value.firstName,
      lastName: userDetails.value.lastName, 
      neighborhood: userDetails.value.neighborhood,
      city: userDetails.value.city,
      state: userDetails.value.state
    }

    
    /* check that first and last name are filled in */
    let response: any[] = this.reglogService.userInformationCheck(userInfo);
    if (response.length === 0) {
      this.emailVerifyLoading = true;
      /* if successful, set up DTO to talk to back end and post */
      let userBundle: UserBundleDTO = {
        registerDTO: this.registerUser,
        userInfoDTO: userInfo
        
      }
  
      this.http.post( this.hostUrl + '/api/register', userBundle).subscribe((response: any) => {
        
        if (response.message === "Verify your account with the link sent to your email!") {
          this.noErrorInFormSubmit = true;
            this.emailVerifyLoading = false;
            this.postResponseMessageValid = response.message;
            return;
          }  else {
            this.emailVerifyLoading = false;
            this.postResponseMessage = response.message;
            return;
            }
        });

    } else {
      /* see all the error objects and collect the error messages to display on html */
    for (let i = 0; i < response.length; i++) {
      if (response[i].message === 1) {
        this.firstNameMessage = response[i].contents;
      }
      if (response[i].message === 2) {
        this.lastNameMessage = response[i].contents;
      }
     }
     this.noErrorInFormSubmit = false;
     return;
    }
  }

}
