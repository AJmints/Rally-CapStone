import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { JoinEvent } from '../models/JoinEvent';
import { JoinEventDTO } from '../models/DTO/JoinEventDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';
@Component({
  selector: 'app-event-join',
  templateUrl: './event-join.component.html',
  styleUrls: ['./event-join.component.css']
})
export class EventJoinComponent implements OnInit {

  hostUrl = 'http://localhost:8080'

  currentUser: string;
  logInStatus: Boolean;

  private getEventUrl: string;
  private joinUrl: string;


  //get event to join
  id: string;
  event: Event;
  eventId: number;

  constructor(private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private http: HttpClient, private router: Router,private route: ActivatedRoute, private eventService: EventService) { 

    this.logInStatus = false;

    this.getEventUrl = this.hostUrl + '/events/event'
    this.joinUrl = this.hostUrl + '/join/event'
   
    this.event;
    this.id = this.route.snapshot.params['id'];

   

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
    console.log(this.id);

    this.eventService.getEvent(this.id).subscribe((response: Event) => {
      this.event = response;
      console.log(response);
    this.eventId = +this.event.id;
    })

  }



  logOut() {
    this.authorize.logOut()
  }

//   getIdNum(str: string) {
//     let num: number = parseInt(str);
//     return num;
// }


joinEvent(joinEventInformation: NgForm) {
  let joinEvent: JoinEventDTO = {
    id: 0,
    userName: this.currentUser,
    event: this.event,
    attending: joinEventInformation.value.attending,
    contactEmail: joinEventInformation.value.contactEmail,
    numAttending: joinEventInformation.value.numAttending, 
    comment: joinEventInformation.value.comment
  }

  console.log(joinEvent);
  this.http.post(this.joinUrl, joinEvent).subscribe((res) => {
    console.log(res)
  });


  // eventJoinInformation.reset();

  this.router.navigate(['/events'])
  .then(() => {
    window.location.reload();
  });

}

}
