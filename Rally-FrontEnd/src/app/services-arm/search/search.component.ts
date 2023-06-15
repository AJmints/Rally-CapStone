import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ViewService } from '../models/ServiceGet';
import { Service } from '../models/Search';
import { QueryList, ViewChildren } from '@angular/core';
import { SortableHeaderDirective, SortEvent, compare } from '../models/Sortable'
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // private userUrl: string;
  currentUser;
  logInStatus: Boolean;
  data: Service[];
  servicesList: Service[];
  filter: string;

  constructor(private authorize: AuthorizeService,private http: HttpClient, private router: Router, private findService: ViewService) {
    this.logInStatus = false;
   }

  ngOnInit(): void {
    if (this.authorize.isloggedIn() === false){
      this.router.navigate(['/login'])
  }
    this.findService.getService().subscribe((response: Service[]) => {
      this.servicesList = response;
      this.data = response;
      console.log(this.servicesList);
      }
    )
  }

  verifyLoggedIn() {

    if (localStorage.getItem('userName') != null) {
      this.currentUser = localStorage.getItem('userName');
      this.logInStatus = true;
    }

  }

  logOut() {
    this.authorize.logOut()
  }

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
  
    // sorting services
    if (direction === '' || column === '') {
      this.servicesList = this.data;
    } else {
      this.servicesList = [...this.data].sort((a, b) => {
        if (column.valueOf() == ("category")) {
          const res = compare(a[column]["category"], b[column]["category"]);
          return direction === 'asc' ? res : -res;
        } else if (column.valueOf() == ("type")) {
          const res = compare(a[column]["type"], b[column]["type"]);
          return direction === 'asc' ? res : -res;
        } else {   
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      }});
    }
  }
}
