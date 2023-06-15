import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceDTO } from '../models/ResourceDTO';
import { NgForm } from '@angular/forms';
import { ResourceService } from '../resource-filter/resource-service';
import { Router } from '@angular/router';
import { Resource } from '../models/Resource';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-resource-update',
  templateUrl: './resource-update.component.html',
  styleUrls: ['./resource-update.component.css']
})
export class ResourceUpdateComponent implements OnInit {   

  private hostUrl = 'http://localhost:8080'
  currentUser;
  logInStatus: Boolean;


  private updateResourceUrl: string;
  private getResourceUrl: string;
  id: string;
  resource: Resource;
  // buttonType: string;
  resourceId: number;



 constructor(private authorize: AuthorizeService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private resourceService: ResourceService) {
    this.logInStatus = false;
    this.getResourceUrl = this.hostUrl + '/resources/resource'
    this.updateResourceUrl = this.hostUrl + '/resources/update/resource'
    this.resource;
    this.id = this.route.snapshot.params['id'];
   }

ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
        this.router.navigate(['/login'])
    }
     console.log(this.id);

    this.resourceService.getResource(this.id).subscribe((response: Resource) => {
      this.resource = response;
      console.log(response);
    this.resourceId = +this.resource.id;
    })


}

                // updateResource() {
                //   this.resourceService.updateResource(this.id, this.resource).subscribe((response: Resource) => {
                //     this.resource = response;
                //   })
                // }  

                // onSubmit() {
                //   this.updateResource;
                // }

                // deleteResource() {
                //   // this.resource.reosurceTitle = "delete";

                // }

                // onSubmit(buttonType: string): void {
                //   if(buttonType==="update") {
                //     this.updateResource();
                //   } else if(buttonType==="delete") {
                //     this.deleteEvent();
                //   }
                // }



                // getIdNum(str: string) {
                //   let num: number = parseInt(str);
                //   console.log(typeof num);
                //   return num;
                // }


updateResource(resourceForm: NgForm) {

    let updateResource: ResourceDTO = {
        id: this.resourceId,

        resourceName: resourceForm.value.resourceName,
        category: resourceForm.value.category,
        address: resourceForm.value.address,
        city: resourceForm.value.city,
        state: resourceForm.value.state,
        zip: resourceForm.value.zip,
        website: resourceForm.value.website,
        telephoneNumber: resourceForm.value.telephoneNumber,
        email: resourceForm.value.email,
        description: resourceForm.value.description
    }

  console.log(updateResource);
  this.http.post(this.updateResourceUrl, updateResource).subscribe((res) => {
    console.log(res)
  });

  //resourceForm.reset();
this.router.navigate(['/resources']).then(()=>{
    window.location.reload();
  });
 }



logOut() {
    this.authorize.logOut()
  }
categories = ["Athletics", "Arts", "Business", "Civic", "Education", "Entertainment", "Fitness", "Hospitality", "Medical", "Park", "Religious", "Retail"];
  categoryModel = {category: this.categories[0]}

}
