import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ForumPost } from '../../models/ForumPost';
import { map } from 'rxjs/operators'
import { ReplyDTO } from '../../models/ReplyDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';
import { ForumPostDTO } from '../../models/ForumPostDTO';
@Component({
  selector: 'app-forum-topic2',
  templateUrl: './forum-topic2.component.html',
  styleUrls: ['./forum-topic2.component.css']
})
export class ForumTopic2Component implements OnInit {
  hostUrl = 'http://localhost:8080'
  forumTopic: string;
  currentUser: string;
  logInStatus: Boolean;
  darktheme: Boolean;
  testArray;
  newArray;
  createPostBoolean: boolean;
  loginLoading: boolean;
  constructor(private http: HttpClient, private router: Router, private themeservice: ThemeserviceService, private authorize: AuthorizeService, private activeUserService: ViewUserService) {
    this.logInStatus = false;
    this.createPostBoolean = false;
    this.darktheme = false;
    this.testArray;
    this.forumTopic = "topic2";
    this.newArray = [];
    this.loginLoading = true;
   }
  
  ngOnInit(): void {
    if (this.authorize.isloggedIn() === true) {
      
      /* Get all information relevent to user */
      this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
      .subscribe((data: any) => {
        this.logInStatus = true;
        this.currentUser = data.viewUser.userName
        this.loginLoading = false;
      },  err => {
        if (err.status === 500) {
          this.logInStatus = false;
          this.currentUser = null;
          this.themeservice.logOut();
          this.loginLoading = false;
        }
      })
  }
    else {
      this.themeservice.logOut();
      this.logInStatus = false;
      this.loginLoading = false;
  }
    this.checkTheme();
    this.getPosts();
  }
  checkTheme(){
      if (localStorage.getItem('theme') == 'dark'){
          this.Dark();
      }
  }
  login(){
    this.router.navigate(["/login"]);
  }
  createPostButton(){
      this.createPostBoolean = true;
  }
  redirectToLogIn(){
    this.router.navigate(["/login"]);
  }
  createPost(postInformation: NgForm){
    this.createPostBoolean = false;
    let postDetails: ForumPostDTO = {
      title: postInformation.value.title,
      description: postInformation.value.description,
      username: this.currentUser,
      category: this.forumTopic
    }
    this.http.post( this.hostUrl + `/Posts`, postDetails).subscribe((res) => {
      this.getPosts();
  });
  }

  getPosts(){
    this.themeservice.getForumTopicPosts(this.forumTopic).subscribe((posts) =>{
      this.newArray = this.themeservice.sortPosts(posts)})
  }

  Light(){
    this.darktheme = false;
    localStorage.setItem('theme', 'light')
}
Dark(){
  this.darktheme = true;
  localStorage.setItem('theme', 'dark')
}
  logOut() {
    this.logInStatus = false;
    this.themeservice.logOut();
  }
  Search(searchInformation: NgForm){
    localStorage.setItem('searchTerm', searchInformation.value.description)
    this.router.navigate(["/forum/search"]);
  }
  LikePost(postId: number){
    let likeDetails : ReplyDTO = {
      username: localStorage.getItem('userName'),
      description: "",
      id: postId
    }
    this.http.post( this.hostUrl + '/LikePost', likeDetails).subscribe((res) => {
      this.getPosts();
    });

  }
}
