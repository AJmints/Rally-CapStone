import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Service, Type } from '../models/Search';
import { ViewService } from '../models/ServiceGet';
import { ViewId } from '../models/ServiceGet';
import { UserEntity } from 'src/app/user-profile-arm/models/UserEntity';
import { ServiceDTO } from '../models/Service';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';


@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.css']
})
export class ServiceItemComponent implements OnInit {

  private hostUrl = 'http://localhost:8080'

  userList: UserEntity[]; 

  private userUrl: string;

  currentUser;
  logInStatus: Boolean;
  servicesList: Service[];
  serviceItem: Service;
  delItem: ServiceDTO[];
  loading: boolean;
  // ids: string;

  ids: string;
  id: number;
  idString: string;
  serviceId: String;
  serviceName: String;
  category: String;
  type: String;
  description: String;
  email: String;
  day: String;
  time: String;
  user: string;

  idArr: String[] = [];
  serviceArr: String[] = [];
  catArr: String[] = [];
  typeArr: String[] = [];
  descArr: String[] = [];
  emailArr: String[] = [];
  dayArr: String[] = [];
  timeArr: String[] = [];
  userNameArr: string[] = [];

  constructor(private authorize: AuthorizeService,private http: HttpClient, private router: Router, private findService: ViewService, private route: ActivatedRoute, private findId: ViewId, private themeservice: ThemeserviceService, private activeUserService: ViewUserService) {
    this.logInStatus = false;
    this.loading = true;
    this.userUrl = this.hostUrl + '/services/delete';
   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }

  this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
  .subscribe((data: any) => {
    this.loading = false;
    this.currentUser = data.viewUser.userName
  })

    this.findService.getService().subscribe((response: Service[]) => {
      this.servicesList = response;
      // console.log(this.servicesList);

      if (this.route.snapshot.queryParams['id']) {
        this.id = this.route.snapshot.queryParams['id'];
      }

      for (let i = 0; i < this.servicesList.length; i++) {
        this.serviceItem = this.servicesList[i];

        this.idString = this.serviceItem["id"];
        this.serviceName = this.serviceItem["service"];
        this.category = this.serviceItem["category"].category;
        this.type = this.serviceItem["type"].type;
        this.description = this.serviceItem["description"];       
        this.email = this.serviceItem["email"];
        this.day = this.serviceItem["day"];
        this.time = this.serviceItem["time"];
        this.user = this.serviceItem["name"];

        this.idArr.push(this.idString);
        this.serviceArr.push(this.serviceName);
        this.catArr.push(this.category);
        this.typeArr.push(this.type);
        this.descArr.push(this.description);
        this.emailArr.push(this.email);
        this.dayArr.push(this.day);
        this.timeArr.push(this.time);
        this.userNameArr.push(this.user);

        // console.log(this.idArr[i]);
        // console.log(this.serviceArr[i]);
        // console.log(this.catArr[i]);        
        // console.log(this.typeArr[i]);
        // console.log(this.descArr[i]);
        // console.log(this.emailArr[i]);
        // console.log(this.dayArr[i]);
        // console.log(this.timeArr[i]);
        // console.log(this.userNameArr[i]);
      }

      this.serviceId = this.idArr[this.id-1];
      this.serviceName = this.serviceArr[this.id-1];
      this.category = this.catArr[this.id-1];
      this.type = this.typeArr[this.id-1];
      this.description = this.descArr[this.id-1];
      this.email = this.emailArr[this.id-1];
      this.day = this.dayArr[this.id-1];
      this.time = this.timeArr[this.id-1];
      this.user = this.userNameArr[this.id-1];
      console.log(this.user);

      this.findId.getId().subscribe((response: UserEntity[]) => {
        this.userList = response;
        console.log(this.userList);
        // console.log(this.userList[0].id);
        console.log(this.user);
        for(let i = 0; i < this.userList.length; i++) {
          if(this.userList[i].userName = this.user) {
            this.ids = this.userList[i].id;
            console.log(this.ids);
            break
          }
          return this.ids;
        }
        console.log(this.user);
      })      
      })



    }



  logOut() {
    this.authorize.logOut()
  }

  deleteItem() {
    this.http.post(this.userUrl, this.id).subscribe((result) => {
      console.log(this.id);
    })
  }
  

}

