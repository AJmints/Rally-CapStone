import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeserviceService } from 'src/app/services/themeservice.service';
import { ReplyDTO } from '../../models/ReplyDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { ViewUserService } from 'src/app/user-profile-arm/user-profile/services/view-user.service';
import { ForumPostDTO } from '../../models/ForumPostDTO';
@Component({
  selector: 'app-community-home',
  templateUrl: './community-home.component.html',
  styleUrls: ['./community-home.component.css']
})
export class CommunityHomeComponent implements OnInit {

  hostUrl = 'http://localhost:8080'

  forumTopic: string;
  currentUser: string;
  logInStatus: Boolean;
  darktheme: Boolean;
  testArray;
  newArray;
  createPostBoolean: boolean;
  userLiked: boolean;
  loginLoading: boolean;
  dbImage: any;
  postResponse: any;
  message;
  messagebol = false;
  favPost: any;
  constructor(private http: HttpClient, private router: Router,  private authorize: AuthorizeService, private themeservice: ThemeserviceService, private activeUserService: ViewUserService) {
    this.logInStatus = false;
    this.createPostBoolean = false;
    this.darktheme = false;
    this.testArray;
    this.newArray = [];
    this.forumTopic = "CommunityHome";
    this.loginLoading = true;

   }
  
  ngOnInit(): void {
    if (this.authorize.isloggedIn() === true) {
      
      this.getPosts();

      /* Get all information relevent to user */
      this.activeUserService.getMainUserBundleByUserName(this.themeservice.getUserName())
      .subscribe((data: any) => {
        // console.log(data)
        this.logInStatus = true;
        this.currentUser = data.viewUser.userName
        this.favPost = data.viewUserPostHistory.viewUserFavoritePost
        this.loginLoading = false;

        for (let fav of this.favPost) {
          for (let post of this.newArray) {
            if (fav.id === post.id) {
              console.log("true?")
              post.favorite = true;
            }
          }
        }
        console.log(this.newArray)
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
  this.http.get( this.hostUrl + '/user/userProfileImage/' + this.themeservice.getUserName()).subscribe((response: any) => {
  if (response.message) {
    return;
  } else {
    this.postResponse = response;
    this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
  }
})
    this.checkTheme();
    // this.getPosts();
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
  

  addToFavorites(forumPost) {
    this.activeUserService.saveToFavorites(forumPost.target.name, "ForumPost");
    let update = this.newArray;
    for (let post of this.newArray) {
      if (post.id === Number(forumPost.target.name)) {
        if (post.favorite === true) {
          post.favorite = null
          update = update.filter((post: any) => post.id !== Number(forumPost.target.name));
          update.push(post)
          this.newArray = [];
          this.newArray = update;
          return this.newArray.sort(function(b, a) {
            return a.id - b.id
          })
        } else {
          post.favorite = true
          update = update.filter((post: any) => post.id !== Number(forumPost.target.name));
          update.push(post)
          this.newArray = [];
          this.newArray = update;
          return this.newArray.sort(function(b, a) {
            return a.id - b.id
          })
        }
      }
    }
    // this.getPosts();
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
  redirectToLogIn(){
    this.router.navigate(["/login"]);
  }
  getPosts(){
    this.themeservice.getForumTopicPosts(this.forumTopic).subscribe((posts) =>{
      this.newArray = this.themeservice.sortPosts(posts)
      // console.log(this.newArray)   
    })
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
      console.log(res)
      this.getPosts();
    });
    
  }
}
