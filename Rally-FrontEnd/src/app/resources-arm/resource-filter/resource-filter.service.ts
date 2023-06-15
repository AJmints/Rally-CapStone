import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Resource } from '../models/Resource';
// import { EventViewComponent } from '../event-view/event-view.component';

@Injectable({
  providedIn: 'root'
})
export class ResourceFilterService {

  private hostUrl = 'http://localhost:8080'  

  private getResourcesByCategoryUrl = this.hostUrl + '/resources/';

  constructor(private http: HttpClient, private router: Router) { }

  public resourceDetails: Resource[];


getResourceByConnect() {
  return this.resourceDetails.filter((resource) => {
    return resource.category === 'connect';
  });
 }

//--

//  getEventByLearn() {
//   return this.eventDetails.filter((event) => {
//     return event.eventCategory === 'learn';
//   });
//  }

//  getEventByVolunteer() {
//   return this.eventDetails.filter((event) => {
//     return event.eventCategory === 'volunteer';
//   });
//  }

//  getEventByDonate() {
//   return this.eventDetails.filter((event) => {
//     return event.eventCategory === 'donate';
//   });
//  }

//  getEventByCelebrate() {
//   return this.eventDetails.filter((event) => {
//     return event.eventCategory === 'celebrate';
//   });
//  }


}
