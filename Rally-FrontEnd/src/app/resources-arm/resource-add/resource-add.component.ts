import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ResourceDTO } from '../models/ResourceDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';

@Component({
  selector: 'app-resource-add',
  templateUrl: './resource-add.component.html',
  styleUrls: ['./resource-add.component.css']
})
export class ResourceAddComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  currentUser: String;
  logInStatus: Boolean;
  private userUrl: string;
  private resourceUrl: string;

  constructor(private authorize: AuthorizeService, private http: HttpClient, private router: Router) {
    this.logInStatus = false;
    this.resourceUrl = this.hostUrl + '/resources/add'
   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
  }


  
  
  logOut() {
    this.authorize.logOut()
  }
//Try
  categories = ["Athletics", "Arts", "Business", "Civic", "Education", "Entertainment", "Fitness", "Hospitality", "Medical", "Park", "Religious", "Retail"];
  categoryModel = {category: this.categories[0]}


  getIdNum(str: string) {
    let num: number = parseInt(str);
    return num;
  }

  onSubmit(resourceForm: NgForm) {
    let newResource: ResourceDTO = {
      id: 0, 
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
    console.log(newResource);
    this.http.post(this.resourceUrl, newResource).subscribe((res) => {
      console.log(res)
      window.location.reload();
    });
  }
}
