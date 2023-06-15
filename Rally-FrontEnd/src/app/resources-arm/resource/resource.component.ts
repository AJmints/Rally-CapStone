import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '../models/Resource';
import { ResourceService } from '../resource-filter/resource-service';
import { ResourceSearchComponent } from '../resource-search/resource-search.component';
import { ResourceDTO } from '../models/ResourceDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';


@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  // currentUser;

  private hostUrl = 'http://localhost:8080'

  logInStatus: Boolean;
  id: string;
  resourceDetails: Resource;

  constructor(private authorize: AuthorizeService, private http: HttpClient, private route: ActivatedRoute, private router: Router, private resourceService: ResourceService) {
    this.logInStatus = false;
    this.resourceDetails;
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }

    console.log(this.id);
    this.resourceService.getResource(this.id).subscribe((response: Resource) => {
      this.resourceDetails = response;
      console.log(response);
    })
  }
  logOut() {
    this.authorize.logOut()
  }
  deleteResource() {
    if(confirm("Are you sure you want to delete this resource?")) {
      this.resourceService.deleteResource(this.id).subscribe(data => {
        console.log(data);
      })
      this.router.navigate(["/resources"])
    .then(() => {
      window.location.reload();
    });
    }
   
  }


}
