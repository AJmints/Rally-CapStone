import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {

 private hostUrl = 'http://localhost:8080'   

  private getResourceByIdUrl = this.hostUrl + '/resources/resource/';
  private updateResourceUrl = this.hostUrl + '/resources/update/resource/';
  // private deleteEventByIdUrl = 'http://localhost:8080/resources/resource/';
  

  constructor(private http: HttpClient, private router: Router) { }

  getResource(id: string) {
    return this.http.get(`${this.getResourceByIdUrl}` + id);
  }

  updateResource(id: string, value: any) {
    return this.http.put(`${this.updateResourceUrl}` + id, value);
    //is this right?
  }

  deleteResource(id: string) {
    return this.http.post( this.hostUrl + '/resources/resource', +id);
    //is this right?
  }


}
