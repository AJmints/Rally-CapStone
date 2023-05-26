import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginDTO } from '../../models/dto/LoginDTO';
import { NgForm } from '@angular/forms';
import { UserEntity } from '../../models/UserEntity';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  userLogginIn: UserEntity;
  incorrectPassword: boolean;
  userEntity: UserEntity;

  constructor(private http: HttpClient,
              private router: Router) 
              { 
  }


  ngOnInit(): void {
    if (localStorage.getItem("userName") !== null) {
      this.router.navigate(["/myProfile"])
    }
  }

  login(userInformation: NgForm ) {
      
    this.incorrectPassword = false;

    // let loginInfo: LoginDTO = {
    //   userName: userInformation.value.userName,
    //   password: userInformation.value.password
    // }

    let userName = userInformation.value.userName;
    let password = userInformation.value.password;

    return this.http.post('http://localhost:8080/api/login', 
      {
        userName,
        password,
      },
      httpOptions
      ).subscribe((data) => console.log(data));


    // this.http.post('http://localhost:8080/api/login', loginInfo).subscribe((response: any) => {    
    //   for (const k in response){
    //     if (k === "failed"){
    //       this.incorrectPassword = true;
    //       return;
    //     } else {            
    //       // this.userLogginIn = response;
    //       console.log(response);
    //       // localStorage.setItem('userName', this.userLogginIn.userName)
    //       // localStorage.setItem('id', this.userLogginIn.id)
    //       // this.router.navigate(["/myProfile"]);
    //     }
    //   }
       
    // });
    
  
  }
}
