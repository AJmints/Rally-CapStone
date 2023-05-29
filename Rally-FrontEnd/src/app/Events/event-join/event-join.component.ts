import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventComponent } from '../event/event.component';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { JoinEvent } from '../models/JoinEvent';
import { JoinEventDTO } from '../models/DTO/JoinEventDTO';
@Component({
  selector: 'app-event-join',
  templateUrl: './event-join.component.html',
  styleUrls: ['./event-join.component.css']
})
export class EventJoinComponent implements OnInit {

  currentUser: String;
  //currentUser is String if logged in???
  logInStatus: Boolean;

  private getEventUrl: string;
  private joinUrl: string;

  id: string;
  // join: Join;
  event: Event;
  eventId: number;

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute, private eventService: EventService) { 

    this.logInStatus = false;

    this.getEventUrl = 'http://localhost:8080/events/event'
    this.joinUrl = 'http://localhost:8080/join/event'
    // this.join;
    this.event;
    this.id = this.route.snapshot.params['id'];

   

  }

  ngOnInit(): void {

    this.verifyLoggedIn();
    //to authenticate user b4 making event

    console.log(this.id);

    this.eventService.getEvent(this.id).subscribe((response: Event) => {
      this.event = response;
      console.log(response);
    this.eventId = +this.event.id;
    })

  }

  verifyLoggedIn() {

    if (localStorage.getItem('userName') != null) {
      this.currentUser = localStorage.getItem('userName');
      this.logInStatus = true;
    }

  
  }

  logOut() {
    // localStorage.clear();
    localStorage.removeItem('userName');
    console.log(localStorage.getItem('userName'))
    this.logInStatus = false;
  }

//   getIdNum(str: string) {
//     let num: number = parseInt(str);
//     return num;
// }


joinEvent(joinEventInformation: NgForm) {
  let joinEvent: JoinEventDTO = {
    // id: 0,
    // id: this.eventId,
    id: 0,
    userName: localStorage.getItem("userName"),
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
