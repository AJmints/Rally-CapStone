import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ViewUserBundle } from '../../models/ViewUserBundle';
import { StorageService } from 'src/app/security/security-service/storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ViewUserService {

  private hostUrl = 'http://localhost:8080';
  private getUserListUrl = this.hostUrl + '/user/search';
  private getUserBundleByUserName = this.hostUrl + '/user/getViewUserBundleInformation/';
  private getMainUserBundle = this.hostUrl + '/user/getMainUserBundleInformation/';

  private postDirectMessageToViewedUser = this.hostUrl + '/user/sendDirectMessage';

  /* Service Response */
  response; 

  constructor(private http: HttpClient, private router: Router, private storage: StorageService) { }

  /* Get Request */
  /* Get Request */
  /* Get Request */
  
  getUserList() {
    return this.http.get(`${this.getUserListUrl}`);
  }

  getViewUserBundleByUserName(username: string): Observable<ViewUserBundle>{
    return this.http.get<ViewUserBundle>(`${this.getUserBundleByUserName}` + username);
  }

  getMainUserBundleByUserName(userName: string) {
    return this.http.get<any>(`${this.getMainUserBundle}` + userName);
  }

  /* Post Methods */
  /* Post Methods */
  /* Post Methods */

  postDirectMessage(directMessage) {
    return this.http.post(`${this.postDirectMessageToViewedUser}`, directMessage);
  }

  /* Service methods */
  /* Service methods */
  /* Service methods */

  
  saveToFavorites(postId, type) {
    let postPresent = false;
    let addFavItem = {
      userName: this.storage.getUserName(),
      postId: postId,
      postType: type
    };
    //return a message of post status (saved or removed)

    this.http.post( this.hostUrl + '/user/addToFavorites', addFavItem).subscribe((data: any) => {
      if (data.message === "Post removed from favorties") {
        this.response = "Post removed from favorties"
      } else if (data.message === "Post added to favorites!") {
        this.response = "Post added to favorites!"
      }
    });
  }


  redirectWhenViewingSelf(userName) {
    if (this.storage.getUserName() === userName) {
      this.router.navigate(["/myProfile"])
      return;
    }
  }

  oneBigList(forumPost, forumReplies, events, services) {  // , resources, restaurantReview, services
    let bigJoin: any[] = [];
    for (let post of forumPost) {
      let uniForumPost = {
        id: Number(post.id),
        type: "ForumPost",
        title: post.title,
        description: post.description,
        hidden: false,
        originalObj: post
      }
      bigJoin.push(uniForumPost);
    }
    for (let reply of forumReplies) {
      let uniForumReply = {
        id: Number(reply.forumPosts.id),
        type: "ForumReply",
        title: `${reply.userEntity.userName} replied in ${reply.forumPosts.title}`,
        description: reply.description,
        hidden: false,
        originalObj: reply
      }
      bigJoin.push(uniForumReply);
    }
    for (let event of events) {
      let uniEvent = {
        id: Number(event.id),
        type: "Event",
        title: event.eventTitle,
        description: event.description,
        hidden: false,
        originalObj: event
      }
      bigJoin.push(uniEvent);
    }
    for (let service of services) {
      let uniService = {
        id: Number(service.id),
        type: "Service",
        title: service.service,
        description: service.description,
        hidden: false,
        originalObj: service
      }
      bigJoin.push(uniService);
    }
    return bigJoin.sort();
  }

}
