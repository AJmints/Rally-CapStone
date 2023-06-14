import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoDTO } from '../../models/dto/UserInfoDTO';
import { NgForm } from '@angular/forms';
import { UserInformation } from '../../models/UserInformation';
import { ViewUserService } from '../services/view-user.service';
import { UserEntity } from '../../models/UserEntity';
import { DirectMessage } from '../../models/Directmessage';
import { DirectMessageDTO } from '../../models/dto/directMessageDTO';
import { NgUserInformation } from '../../models/ng-model/UserInformation';
import { HiddenPost } from '../../models/HiddenPost';
import { Event } from 'src/app/Events/models/event';
import { HidePostDTO } from '../../models/dto/HidePostDTO';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
import { StorageService } from 'src/app/security/security-service/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  /* Host Url */
  private hostUrl = 'http://localhost:8080';
  
  /* logged in user information */
  userEntity: UserEntity;
  userInformation: UserInformation;
  model: NgUserInformation;
  
  /* Direct Message variables */
  respondToDm: UserEntity;
  userEntityDmList: UserEntity[];
  userProfilePics: any[] = [];
  allDmHistory: DirectMessage[];
  conversation: DirectMessage[] = [];
  commentBox: any;

  /* Post History */
  allPost: any[] = [];
  allPostFilter: any[];
  hiddenPost: HiddenPost[];
  forumPost: any[];
  forumReplies: any[];
  eventPost: Event[];
  servicePost: any[];
  
  /* HTML booleans */
  logInStatus: boolean = true;
  notHidden: boolean = true;
  noError: boolean = true;
  tooManyChar: boolean = false;
  changeInfo: boolean = true;
  userDms: boolean = true;
  changeProfilePic: boolean = true;
  filterActive: boolean = false;
  uploadErrorMsg: any[];
  loading: boolean = false;
  sendingMessage:boolean = false;

  /* HTML variables */
  @ViewChild('dmBottomOfScroll') private scrollMe: ElementRef;
  currentUser = this.storageService.getUserName();

  /* Image uploading */
  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  image: any;

  constructor(private http: HttpClient, 
              private viewUser: ViewUserService,
              private activeUserService: ViewUserService, 
              private cdref: ChangeDetectorRef,
              private authorize: AuthorizeService,
              private storageService: StorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    /* Checks if user is logged in */
    if (this.authorize.isloggedIn() === true) {
      this.loading = true;
      
      /* Get all information relevent to user */
      this.activeUserService.getMainUserBundleByUserName(this.storageService.getUserName()).subscribe((data: any) => {
       
        this.userEntity = data.viewUser;
        this.userInformation = data.viewUserInformation;
        this.allDmHistory = data.viewUserDmHistory.directMessageList;
        this.userEntityDmList = data.viewUserDmHistory.userEntities;
        this.hiddenPost = data.viewUserPostHistory.viewUserHiddenPost;
        this.forumPost = data.viewUserPostHistory.viewUserForumPost;
        this.forumReplies = data.viewUserPostHistory.viewUserForumReplies;
        this.eventPost = data.viewUserPostHistory.viewUserEventPost;      
        this.servicePost = data.viewUserPostHistory.viewUserServicePost;
        this.model = new NgUserInformation(this.userInformation.firstName,
                                           this.userInformation.lastName,
                                           this.userInformation.neighborhood,
                                           this.userInformation.city,
                                           this.userInformation.state);
        /* Remove active user from dm list */
        this.userEntityDmList = this.userEntityDmList.filter((user: UserEntity) => user.userName !== this.storageService.getUserName());

        let dataProfilePics = data.viewUserDmHistory.profilePictures;
        
        /* Make a list of objects with user name and user image for thumbnail display*/
        let makeThumbNails = this.userEntityDmList;
        for (let pic of dataProfilePics) {
          for (let user of makeThumbNails) {
            if (user.userName === pic.userId) {
              let picAndName = {
                userName: user.userName,
                image: 'data:image/jpeg;base64,' + pic.image
              }
              this.userProfilePics.push(picAndName);
              makeThumbNails = makeThumbNails.filter((user: UserEntity) => user.userName !== picAndName.userName)
            }
          }
        }
        /* Add remaining users to the list who don't have images */
        for (let user of makeThumbNails) {
          let picAndName = {
            userName: user.userName,
            image: null
          }
          this.userProfilePics.push(picAndName);
        }


        /* Get all user post organized to display */
        this.allPost = this.activeUserService.oneBigList(this.forumPost, this.forumReplies, this.eventPost, this.servicePost);
        this.allPostFilter = this.allPost;
        this.updateHiddenPost();
        this.loading = false;
      },  err => {
        /* temporary error handling / want to build better handling approach */
        if (err.status === 500 || err.status === 400) {
          this.authorize.logOut();
        }
      })

      /* Get user Profile pic */
      /* bundle in userbundle or change to user userName */
      this.http.get( this.hostUrl + '/user/userProfileImage/' + this.storageService.getUserName()).subscribe((response: any) => {
        if (response.message) {
          return;
        } else {
          this.postResponse = response;
          this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
        }
      },  err => {
        if (err.status === 500 || err.status === 400) {
          this.authorize.logOut();
        }
      })
    } 
    else {
      this.authorize.logOut();
    }
  }

  /* This method controls what is visible on the users post history based on checkbox input in html 
  | ForumPost | Events | Resouces | Services | Restaurants*/
  userPostHistoryFilter(event) {
    if (event.target.checked) {
      if (this.filterActive === false) {
        this.filterActive = true;
        this.allPost = [];
      }
      for (let obj of this.allPostFilter) {
        if (obj.type === event.target.name) {
          this.allPost.push(obj);
        }
      }
      return this.allPost
    } else {

      this.allPost = this.allPost.filter((obj) => obj.type !== event.target.name);

      if (this.allPost.length === 0) {
        this.filterActive = false;
        return this.allPost = this.allPostFilter;
      } else {
        return this.allPost;
      }      
    }
  }
  
  /* Learning about LifeCycle Hooks in Angular / prevents error in the console when viewing 
    direct messages while using the [scrollTop]="scrollMe.scrollHeight" in HTML*/
  /* Might cause a memory leak, further investigation required */
  ngAfterContentChecked() {
    this.scrollMe = this.scrollMe;
    this.cdref.detectChanges();
  }

  /* Checks the post to see if it is hidden and flags it as so to display on post (or not) on post history */
  updateHiddenPost() {
    for (let hide of this.hiddenPost) {
      for (let post of this.allPost) {
        if (hide.postType === post.type && hide.hidePostId === post.id) {
          post.hidden = true;
        }
      }
    }
  }

  /* Hide requested post from profile */
  hidePost(post: any) {

    let hidePostDTO: HidePostDTO = {
      postType: post.type,
      hidePostId: post.id,
      userId: Number(this.userEntity.id)
    }

    this.http.post( this.hostUrl + '/user/hidePostList', hidePostDTO).subscribe((response: any) => {
      /* Temp solution to refresh page without location.reload() */
      this.router.navigate(['/register'])
    })
  }

  /* Remove post from hidden post | Make post public */
  unhidePost(post: any) {

    let hidePostDTO: HidePostDTO = {
      postType: post.type,
      hidePostId: post.id,
      userId: Number(localStorage.getItem("id"))
    }

    this.http.post( this.hostUrl + '/user/unHidePost', hidePostDTO).subscribe((response) => {
      /* Temp solution to refresh page without location.reload() */
      this.router.navigate(['/register'])
    })
  }

  /* Select file to be uploaded */
  public onImageUpload(event) {
    this.uploadErrorMsg= []
    if (event.target.files[0].size > 1024000) {   
      this.uploadErrorMsg = ["File is too large, please select a smaller image", true];
      this.uploadedImage = null;
      return;
    } else {
      this.uploadedImage = event.target.files[0];
    }
  }

  /* Upload the image to the database */
  imageUploadAction() {
    this.uploadErrorMsg = []
    if (this.uploadedImage === null || this.uploadedImage === undefined) {
      this.uploadErrorMsg = ["Please choose a valid image to upload.", true]
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append('image', this.uploadedImage, this.storageService.getUserName());

    this.http.post( this.hostUrl + '/user/upload/image', imageFormData, {observe: 'response'}).subscribe((response: any) => {
      if (response.status === 200) {
        this.postResponse = response;
      } else { 
        console.log(response)
        return;
      }
      location.reload();
    })
  }  

  cancelPhotoUpload() {
    this.changeProfilePic = true;
    this.uploadedImage = null;
  }


  /* Display conversation with user selected */
  displayConversation( userDms: string) {
    this.conversation = [];
    this.respondToDm = null;

    for (let i = 0; i < this.userEntityDmList.length; i++) {
        if (this.respondToDm === null && userDms == this.userEntityDmList[i].userName) {
        this.respondToDm = this.userEntityDmList[i];
      }
    }
    
    for (let i = 0; i < this.allDmHistory.length; i++) {
      if (this.storageService.getUserName() === this.allDmHistory[i].sentByUserName && this.respondToDm.userName === this.allDmHistory[i].receivedByUserName) {
        this.conversation.push(this.allDmHistory[i]);
      } else if (this.storageService.getUserName() === this.allDmHistory[i].receivedByUserName && this.respondToDm.userName === this.allDmHistory[i].sentByUserName) {
        this.conversation.push(this.allDmHistory[i]);
      }
    }
    // console.log(`${localStorage.getItem('userName')} is viewing and messaging ${this.respondToDm.userName}`)
    this.userDms = false;

  }

  /* After sending a message to a user, this refreshes the chat history */
  refreshConversation( chatWithUser: string) {
    /* this.converstaion = [] is causing an error because I don't know how to handle lifecycle hooks yet. */
    /* Want to rebuild Direct Messages with different architecture */

    this.conversation = [];
    for (let i = 0; i < this.allDmHistory.length; i++) {
      if (this.storageService.getUserName() === this.allDmHistory[i].sentByUserName && chatWithUser === this.allDmHistory[i].receivedByUserName) {
        this.conversation.push(this.allDmHistory[i]);
      } else if (this.storageService.getUserName() === this.allDmHistory[i].receivedByUserName && chatWithUser === this.allDmHistory[i].sentByUserName) {
        this.conversation.push(this.allDmHistory[i]);
      }
    }
  }

  /* Sends direct message respone to the database */
  respondToUserDm( userResponse: NgForm ) {
    /*reset error message on user messages if errors occured */
    this.noError = true;
    this.tooManyChar = false;
    this.sendingMessage = true;

    let sendDirectMessage: DirectMessageDTO = {
      receivedByUserId: this.respondToDm.id,
      receivedByUserName: this.respondToDm.userName,
      sentByUserId: this.userEntity.id,
      sentByUserName: this.storageService.getUserName(),
      messageContent: userResponse.value.messageContent
    }

    /* doesn't allow message to be sent if contents don't conform to length requirements */
    if (sendDirectMessage.messageContent === undefined || sendDirectMessage.messageContent.length < 3) {
      this.noError = false;
      return
    } else if ( sendDirectMessage.messageContent.length > 2500) {
      this.tooManyChar = true;
      return
    }

    this.commentBox = '';

    /* Post message to backend if message is valid then refresh the conversation to reflect message sent */
    this.viewUser.postDirectMessage(sendDirectMessage).subscribe((response: DirectMessage[]) => {
      this.sendingMessage = false;
      this.allDmHistory = response;  
      this.refreshConversation(this.respondToDm.userName)
    });   
  } 

  /* Updates the users information */
  updateUserInfo( userDetails: NgForm ) {
    let userInfo: UserInfoDTO = {
      firstName: userDetails.value.firstName,
      lastName: userDetails.value.lastName, 
      neighborhood: userDetails.value.neighborhood,
      city: userDetails.value.city,
      state: userDetails.value.state
    }
    this.http.put<any>( this.hostUrl + '/user/update-user-information/' + this.userEntity.id, userInfo).subscribe((response: UserInformation) => {
        this.userInformation = response
        this.changeInfo=true;
        return;
    });
  }

  /* Boolean to change the user information into an editable form on user profile */
  editProfileDetails() {
    this.changeInfo=false;
  }

  logOut() {
    this.authorize.logOut()
  }
}
