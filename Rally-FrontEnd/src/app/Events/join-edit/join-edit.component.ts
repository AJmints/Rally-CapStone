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
  selector: 'app-join-edit',
  templateUrl: './join-edit.component.html',
  styleUrls: ['./join-edit.component.css']
})

export class JoinEditComponent implements OnInit {

  currentUser: string;
  logInStatus: Boolean;

  private getJoinUrl: string;
  private updateJoinUrl: string;
  private deleteJoinUrl: string;

  //get event user is joining
  id: string;
  event: Event;
  eventId: number;
 
  //get joined form
  joinedEvents: JoinEvent [] = [];
  join: JoinEvent;
  joinLoading: boolean;
  
  constructor(private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private http: HttpClient, private router: Router, private route: ActivatedRoute, private eventService: EventService) { 

    this.logInStatus = false;

   
    this.getJoinUrl = 'https://rallybackendtesting-production.up.railway.app/join/join/'
    this.updateJoinUrl = 'https://rallybackendtesting-production.up.railway.app/join/edit/join';
    this.deleteJoinUrl = 'https://rallybackendtesting-production.up.railway.app/join/edit/delete';
 
    this.id = this.route.snapshot.params['id'];
    this.event;
    this.eventId;
    
    this.joinedEvents;
    this.join;

  }

  ngOnInit(): void {

    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
  else {
    this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
    .subscribe((data: any) => {
      this.currentUser = data.viewUser.userName
      this.getJoin();

    })
  }

    console.log(this.id);

    this.eventService.getEvent(this.id).subscribe((response: Event) => {
      this.event = response;
      console.log(response);
    this.eventId = +this.event.id;
    console.log(typeof(this.eventId));
    })



    this.http.get(this.getJoinUrl).subscribe((response: JoinEvent[]) => {
      console.log(response);
      this.joinedEvents = response;

    
     
    })


  }

  //find which join object to populate edit join form
  getJoin() {
    for(let i = 0; i < this.joinedEvents.length; i++) { 
      if(this.joinedEvents[i].userName === this.currentUser && this.joinedEvents[i].event.id === this.event.id) {
        this.join = this.joinedEvents[i];
        console.log(this.join);
      }
    }
    return this.join;
  }



  updateJoin(joinEventInformation: NgForm) {


    let updateJoin: JoinEventDTO = {
    id: this.join.id,
    userName: this.currentUser,
    event: this.event,
    attending: joinEventInformation.value.attending,
    contactEmail: joinEventInformation.value.contactEmail,
    numAttending: joinEventInformation.value.numAttending, 
    comment: joinEventInformation.value.comment
    }
  
    console.log(updateJoin);
    this.http.post(this.updateJoinUrl, updateJoin).subscribe((res) => {
      console.log(res)
    });
  
    // joinEventInformation.reset();
    
    this.router.navigate(["/events"])
    .then(() => {
      window.location.reload();
    });
   
  
  }

 
  
  deleteJoin() {
    if(confirm("Are you sure you don't want to attend this event?")) {
      this.http.post(this.deleteJoinUrl, this.join.id).subscribe(data => {
        console.log(data);
      })
      this.router.navigate(["/events"])
    .then(() => {
      window.location.reload();
    });
    }
   
  }



  logOut() {
    this.authorize.logOut()
  }



}
