import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../models/event';
import { JoinEvent } from '../models/JoinEvent';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  isLoading: boolean = true;

  //login 
  currentUser;
  logInStatus: Boolean;

  //get requests for events, join forms
  private eventsUrl: string;
  private joinUrl: string;

  //displaying events, filters
  eventList: Event[] = [];
  filteredEvents: Event[] = [];

  //calendar filter
  selected: Date | null;

  //optional: showing num attending 
  joinedEvent: JoinEvent [] = [];
  numJoined: number = 0;
  

  constructor(private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService,private http: HttpClient, private router: Router) {
    this.logInStatus = false;

    this.eventsUrl = this.hostUrl + '/events/events/'
    this.joinUrl = this.hostUrl + '/join/join/'

    this.eventList;
    this.filteredEvents;

    this.selected;

    this.joinedEvent;
    this.numJoined;
  

  

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
   
    this.http.get(this.eventsUrl).subscribe((response: Event[]) => {
      console.log(response);
      this.eventList = response;
      this.allEvents();
    })


    // console.log(this.joinedEvent);

    this.http.get(this.joinUrl).subscribe((response: JoinEvent[]) => {
      console.log(response);
      this.joinedEvent = response;

     
    })

  
  }

  //show num attending for each event
  getNumJoined(eventId: string) {
    this.numJoined = 0;
    for(let i = 0; i < this.joinedEvent.length; i++) {
      if(this.joinedEvent[i].event.id === eventId) {
        this.numJoined += this.joinedEvent[i].numAttending;
      }
    }
    return this.numJoined;
  }


//calendar filter
  byDate() {
    this.filteredEvents.splice(0);
    for(let i = 0; i < this.eventList.length; i++) {
      if(this.eventList[i].datetime.includes(this.selected.toISOString().slice(0,10))) {
        this.filteredEvents.push(this.eventList[i])
      } 
    }
    return this.filteredEvents;
  }


//event category filter
filter(string: string) {
    this.filteredEvents.splice(0);
    for(let i = 0; i < this.eventList.length; i++) {
      if ( this.eventList[i].eventCategory === string) {
        this.filteredEvents.push(this.eventList[i])
      }
    }

    console.log(this.filteredEvents)
    return this.filteredEvents;
 
  };

//view all filter
  viewAll() {
    this.filteredEvents.splice(0);
    for(let i = 0; i < this.eventList.length; i++) {
      this.filteredEvents.push(this.eventList[i]);
    }
    return this.filteredEvents;
  }

  allEvents() {
    return this.viewAll();
  }

  // reset() {
  //   window.location.reload();
  // }

  logOut() {
    this.authorize.logOut()
  }

}



  

