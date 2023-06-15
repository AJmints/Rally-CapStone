import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventDTO } from '../models/DTO/EventDTO';
import { NgForm } from '@angular/forms';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  hostUrl = 'http://localhost:8080'

  currentUser: string;
  logInStatus: Boolean;
  private eventUrl: string;



  constructor(private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private http: HttpClient, private router: Router) {
    this.logInStatus = false;
    this.eventUrl = this.hostUrl + '/events/create'

   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
  else {
    this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
    .subscribe((data: any) => {
      this.currentUser = data.viewUser.userName
    })
  }
  }


  logOut() {
    this.authorize.logOut()
  }
  getIdNum(str: string) {
    let num: number = parseInt(str);
    return num;
}


  registerNewEvent(eventInformation: NgForm) {
    let createNewEvent: EventDTO = {
      id: 0,
      userName: this.currentUser,
      eventHost: eventInformation.value.eventHost,
      contactEmail: eventInformation.value.contactEmail,
      eventTitle: eventInformation.value.eventTitle, 
      datetime: eventInformation.value.datetime,
      eventAddress: eventInformation.value.eventAddress,
      eventCategory: eventInformation.value.eventCategory,
      description: eventInformation.value.description,
      imageId: eventInformation.value.imageId
    }

    console.log(createNewEvent);
    this.http.post(this.eventUrl, createNewEvent).subscribe((res) => {
      console.log(res)
    this.router.navigate(['/events'])
    });

    // eventInformation.reset();
   

  }

 





}
