import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Resource } from '../models/Resource';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';



@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.css']
})
export class ResourceSearchComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'
  
  isLoading: boolean = true;

  currentUser;
  logInStatus: Boolean;
  private resourceUrl: string;
  
  resourceList: Resource[] = [];
  filteredResources: Resource[] = [];

  
  
  
  
  
  
  
  
  constructor(private authorize: AuthorizeService, private http: HttpClient, private router: Router) {
    this.logInStatus = false;
    this.resourceUrl = this.hostUrl + '/resources/resources/'
    this.resourceList;
    this.filteredResources;


   }
  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }

    this.http.get(this.resourceUrl).subscribe((response: Resource[]) => {
      console.log(response);
      this.resourceList = response;
      this.allResources();
    })
  }
  

  filter(string: string) {
    this.filteredResources.splice(0);
    for(let i = 0; i < this.resourceList.length; i++) {
      if ( this.resourceList[i].category === string) {
        this.filteredResources.push(this.resourceList[i])
      }
    }

    console.log(this.filteredResources)
    return this.filteredResources;
 
  };

  //VIEW ALL
  viewAll() {
    this.filteredResources.splice(0);
    for(let i = 0; i < this.resourceList.length; i++) {
      this.filteredResources.push(this.resourceList[i]);
    }
    return this.filteredResources;
  }

  allResources() {
    return this.viewAll();
  }

  logOut() {
    this.authorize.logOut()
  }

}
