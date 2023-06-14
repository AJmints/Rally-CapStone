import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEntity } from '../../models/UserEntity';
import { ViewUserService } from '../services/view-user.service';
import { ViewUserBundle } from '../../models/ViewUserBundle';
import { NgForm } from '@angular/forms';
import { DirectMessageDTO } from '../../models/dto/directMessageDTO';
import { DirectMessage } from '../../models/Directmessage';
import { HttpClient } from '@angular/common/http';
import { HiddenPost } from '../../models/HiddenPost';
import { AuthorizeService } from 'src/app/security/security-service/authorize.service';
@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css']
})
export class ViewUserProfileComponent implements OnInit, AfterViewChecked {

  /* Host Url */
  private hostUrl = 'http://localhost:8080';

  /* Viewing Users information */
  viewUserName: string;
  userEntityInformation: ViewUserBundle;

  /* Direct Message with active user */
  dmList: DirectMessage[];
  conversation: DirectMessage[];
  commentBox: any;
  sendingMessage: boolean = false;

  /* User Profile Pic */
  dbImage: any;

  /* Post History */
  allPost: any[] = [];
  allPostFilter: any[];
  hiddenPost: HiddenPost[];
  forumPost: any = [];

  /* HTML booleans */
  noError: boolean = true;
  tooManyChar: boolean = false;
  showDmHistory = false;
  dmCharacters = true;
  userReal = true;
  filterActive = false;
  loading: boolean = false;

  @ViewChild('dmBottomOfScroll') private myScrollContainer: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, 
              private viewUser: ViewUserService,
              private authorize: AuthorizeService,
              private http: HttpClient) {
   }

  ngOnInit() {

    if (this.authorize.isloggedIn() !== true) {
      this.authorize.logOut();
    }
    this.loading = true;
    /* Pulling userName and userId from  */
    this.activatedRoute.paramMap.subscribe(params => {
    this.viewUserName = params.get('userName');
    if (params.get('userName') === '404') {
      this.router.navigate(['/invalidUser/404'])
    }
    });

    /* If you tried to view yourself, you will be redirected to the 'myProfile' route */
    this.viewUser.redirectWhenViewingSelf(this.viewUserName);

    /* This method gets a bundle of information I want to display on the view user page */
    this.viewUser.getViewUserBundleByUserName(this.viewUserName).subscribe((data: any) => {
      if (data.message) {
        this.userReal = false;
        return;
      }
      this.userEntityInformation = data;
      this.allPost = data.updatedPostHistoryViewUser;
      this.allPostFilter = this.allPost;


      /* Something to address, send the conversation list already sorted from the back */
      this.dmList = data.viewUserDmHistory.directMessageList;
      this.displayConversation(this.userEntityInformation.viewUser);
      this.scrollToBottom;
      this.loading = false;
    },  err => {
      /* temporary error handling / want to build better handling approach */
      if (err.status === 500 || err.status === 400) {
        this.authorize.logOut();
      }
    })

    /* Get view users profile picture */
    this.http.get(this.hostUrl + '/user/userProfileImage/' + this.viewUserName).subscribe((response: any) => {
      if (response.message) {
        return;
      } else {
        this.dbImage = 'data:image/jpeg;base64,' + response.image;
      }
    },  err => {
      /* temporary error handling / want to build better handling approach */
      if (err.status === 500 || err.status === 400) {
        this.authorize.logOut();
      }
    })  
  }

  /* Lifecycle hook learnings, this scrolls the dm display to the bottom automatically */
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  /* Method to scroll dm display to the bottom automatically */
  scrollToBottom() {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  /* Filter option to display specific posts from viewed user */
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

  /* Send Dm to viewed user */
  viewingUserSendDM(dmMessageDetails: NgForm) {
    this.dmCharacters = true;
    this.tooManyChar = false;
    this.sendingMessage = true;

    let sendDirectMessage: DirectMessageDTO = {
      receivedByUserId: this.userEntityInformation.viewUser.id,
      receivedByUserName: this.userEntityInformation.viewUser.userName,
      sentByUserId: localStorage.getItem('id'),
      sentByUserName: localStorage.getItem('userName'),
      messageContent: dmMessageDetails.value.messageContent
    }

    /*This checks if the message contents conform to the character limitations */
    if (sendDirectMessage.messageContent === undefined || sendDirectMessage.messageContent.length < 3) {
      this.dmCharacters = false;
      return;
    } else if ( sendDirectMessage.messageContent.length > 2500) {
      this.tooManyChar = true;
      return
    }

    this.commentBox = '';

    /* Posts the dm if it doens't trigger any errors */
    this.viewUser.postDirectMessage(sendDirectMessage).subscribe((response: DirectMessage[]) => {
      this.sendingMessage = false;
      this.dmList = response;
      this.displayConversation(this.userEntityInformation.viewUser);
    });
  }

  /* Displays the conversation with viewed user */
  displayConversation( userDms: UserEntity) {
    this.conversation = [];

    for (let user of this.dmList) {
      if (localStorage.getItem('userName') === user.sentByUserName && userDms.userName === user.receivedByUserName) {
        this.conversation.push(user);
      } else if (localStorage.getItem('userName') === user.receivedByUserName && userDms.userName === user.sentByUserName) {
        this.conversation.push(user);
      }
    }
  }


  logOut() {
    this.authorize.logOut();
  }

}
