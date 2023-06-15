import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Event } from '../models/event';
import { EventComponent } from '../event/event.component';
import { EventService } from '../services/event.service';
import { EventDTO } from '../models/DTO/EventDTO';
import { NgForm } from '@angular/forms';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  hostUrl = 'http://localhost:8080'

  currentUser;
  logInStatus: Boolean;


  private updateEventUrl: string;
  private getEventUrl: string;
  private deleteEventUrl: string;

  //get event to edit
  id: string;
  event: Event;
  eventId: number;



  constructor(private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private http: HttpClient, private route: ActivatedRoute, private router: Router, private eventService: EventService) {
 this.logInStatus = false;
    this.getEventUrl = this.hostUrl + '/events/event'
    this.updateEventUrl = this.hostUrl + '/events/edit/event'
    this.deleteEventUrl = this.hostUrl + '/events/edit/delete'

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

updateEvent(eventInformation: NgForm) {


  let updateEvent: EventDTO = {
    id: this.eventId,
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

  console.log(updateEvent);
  this.http.post(this.updateEventUrl, updateEvent).subscribe((res) => {
    console.log(res)
  });

  // eventInformation.reset();

  this.router.navigate(["/events"])
  .then(() => {
    window.location.reload();
  });
 

}

deleteEvent() {
  if(confirm("Are you sure you want to delete this event?")) {
    this.eventService.deleteEvent(this.id).subscribe(data => {
      console.log(data);
      this.router.navigate(["/events"])
    })
  }
 
}


  logOut() {
    this.authorize.logOut()
  }

}
