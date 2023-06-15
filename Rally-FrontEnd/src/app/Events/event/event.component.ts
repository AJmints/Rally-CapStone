import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../models/event';
import { EventService } from '../services/event.service';
import { JoinEvent } from '../models/JoinEvent';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  hostUrl = 'http://localhost:8080'

  currentUser;
  logInStatus: Boolean;


  // private eventUrl: string;

  //to capture event, event.id
  id: string;
  eventDetails: Event;
  currentUserButtonLoading: boolean;
  //to display comments, num attending
  joinUrl: string;
  joinedEvent: JoinEvent [] = [];
  numJoined: number = 0;
  commentDisplay: string[] = [];

  //verify user to display update/delete options
  userJoined: boolean;


  constructor(private themeservice: ThemeserviceService, private activeUserService: ViewUserService, private authorize: AuthorizeService,private http: HttpClient, private route: ActivatedRoute, private router: Router, private eventService: EventService) {
    this.logInStatus = false;
    this.joinUrl = this.hostUrl + '/join/join/'
    this.eventDetails;
    this.id = this.route.snapshot.params['id'];
    this.joinedEvent;
    this.numJoined;
    this.commentDisplay;
    this.currentUserButtonLoading = true;
    this.userJoined = false;

   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
  else {
    this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
    .subscribe((data: any) => {
      this.currentUser = data.viewUser.userName
      this.getUserJoined();
      this.currentUserButtonLoading = false;
    })

    console.log(this.id);
    this.eventService.getEvent(this.id).subscribe((response: Event) => {
      this.eventDetails = response;
      console.log(response);
    
      this.http.get(this.joinUrl).subscribe((data: JoinEvent[]) => {
        console.log(data);
        this.joinedEvent = data;
  
        this.getNumJoined();
        this.getComments();
  
      })
    })

    console.log(this.joinedEvent);
  }




  }


//get num attending event
  getNumJoined() {
    for(let i = 0; i < this.joinedEvent.length; i++) {
      if(this.joinedEvent[i].event.id === this.eventDetails.id) {
        this.numJoined += this.joinedEvent[i].numAttending;
      } 
    }
    return this.numJoined;
  }


//comments from join form
  getComments() {
    for(let i = 0; i < this.joinedEvent.length; i++) {
      if(this.joinedEvent[i].event.id === this.eventDetails.id && this.joinedEvent[i].comment !== null) {
        this.commentDisplay.push(this.joinedEvent[i].comment);
      }
    }
    return this.commentDisplay;
  }



  //verify user for visible update/delete button
  getUserJoined() {
    for(let i = 0; i < this.joinedEvent.length; i++) {
      if(this.joinedEvent[i].event.id === this.eventDetails.id && this.joinedEvent[i].userName === this.currentUser) {
        this.userJoined = true;
      }
    }
    return this.userJoined;
  }

  logOut() {
    this.authorize.logOut()
  }

}
