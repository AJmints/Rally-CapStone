import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  hostUrl = 'http://localhost:8080'

  private getEventByIdUrl = this.hostUrl + '/events/event/';
  private updateEventUrl = this.hostUrl + '/events/edit/event/';
  private deleteEventUrl = this.hostUrl + '/events/edit/delete';
  private updateJoinUrl = this.hostUrl + '/join/edit/join/';
  private deleteJoinUrl = this.hostUrl + '/join/edit/delete/';
  

  constructor(private http: HttpClient, private router: Router) { }

  getEvent(id: string) {
    return this.http.get(`${this.getEventByIdUrl}` + id);
  }

  updateEvent(id: string, value: any) {
    return this.http.put(`${this.updateEventUrl}` + id, value);
  }

  deleteEvent(id: string) {

    return this.http.post(`${this.deleteEventUrl}`, +id);
  }




  // getJoin(id: string) {
  //   return this.http.get(`${this.getJoinByIdUrl}` + id);

  // }

  updateJoin(id: string, value: any) {
    return this.http.put(`${this.updateJoinUrl}` + id, value);
  }

  deleteJoin(id: string) {

    return this.http.post(`${this.deleteJoinUrl}`, +id);
  }


}
