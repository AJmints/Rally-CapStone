import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ForumPostDTO } from '../community-forum-arm/models/ForumPostDTO';
import { HttpClient } from '@angular/common/http';
import { ForumPost } from '../community-forum-arm/models/ForumPost';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizeService } from '../security/security-service/authorize.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ThemeserviceService {

  private hostUrl = 'http://localhost:8080'

  testArray1: ForumPost[];
  constructor(private http: HttpClient, private cookieService: CookieService,
    private authorize: AuthorizeService,
    private router: Router) { 
  }

switchToLightTheme(){
    let background = document.getElementById('theme');
    let sections = document.querySelectorAll("body");
    sections.forEach((section) => {section.setAttribute('class', 'white-theme')});
    background.setAttribute('class', 'white');
    localStorage.setItem('theme', 'light');
}
switchToDarkTheme(){
  let background = document.getElementById('theme');
  let sections = document.querySelectorAll("body");
  sections.forEach((section) => {section.setAttribute('class', 'black-background')});
  background.setAttribute('class', 'black');
  localStorage.setItem('theme', 'dark'); 
}
createAPost(postInfo: NgForm, forumTopic: string){
  let postDetails: ForumPostDTO = {
    title: postInfo.value.title,
    description: postInfo.value.description,
    username: localStorage.getItem('userName'),
    category: forumTopic
  }
  this.http.post( this.hostUrl + `/Posts`, postDetails).subscribe((res) => {
    console.log(res)
});
window.location.reload();
}
getForumTopicPosts(forumTopic: string){
  return this.http.get<{[key: string]: ForumPost}>( this.hostUrl + `/Posts`).pipe(map((res) => {
    const posts = [];
    for(const key in res){
      if (res[key].category == forumTopic){
          posts.push({...res[key]})
      }
    }
    return posts;
  }))
}
sortPosts(posts: ForumPost[]){
  return posts.sort(function(b, a) {
    return a.id - b.id
  })
}
getAllForumPosts(){
  return this.http.get<{[key: string]: ForumPost}>( this.hostUrl + '/Posts').pipe(map((res) => {
    const posts = [];
    for(const key in res){
          posts.push({...res[key]})

    }
    return posts;
  }))
}
searchPosts(posts: ForumPost[]){
    const sortedPosts = [];
    for(const key in posts){
      if (posts[key].title.toLowerCase().includes(localStorage.getItem('searchTerm').toLowerCase()) || posts[key].description.toLowerCase().includes(localStorage.getItem('searchTerm').toLowerCase()) || posts[key].userEntity.userName.toLowerCase().includes(localStorage.getItem('searchTerm').toLowerCase())){
          sortedPosts.push(posts[key]);
      }
    }
    return sortedPosts;
}
testPost = async () => {
  const resp = await fetch( this.hostUrl + '/Posts');
  const data = await resp.json();
  let newArray = data;
  return newArray
}

public getUserName(): any {

  if (this.cookieService.check('token') === false){
    return null;
  }

  let tokenInfo: any = this.cookieService.get('token')
  const payload = atob(tokenInfo.split(".")[1])

  try {
    JSON.parse(payload)
  } catch(e) {
    this.authorize.logOut();
    return;
  }
  const parsedPayload = JSON.parse(payload)
  return parsedPayload.sub;

}
logOut() {
  sessionStorage.clear();
  localStorage.removeItem('userName');
  localStorage.removeItem('id');
  this.cookieService.delete('token');
  return false;
}
}
