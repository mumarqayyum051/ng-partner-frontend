import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ChatService } from '../core/services/chat.service';
import { FriendsService } from '../core/services/friends.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})
export class NetworkComponent implements OnInit {
  isMenuCollapsed = false;

  items = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];
  isConnectCardVisible = false;
  users = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];
  isLoading: boolean;
  friends: any = [];
  search = '';
  toggle = false;
  selectedUser;
  selectedIndex: number;
  currentUser: any;
  currentRoute = localStorage.getItem('currentRoute');
  showList: boolean = true;
  showCard: boolean = false;
  showCards: boolean = true;
  desktopView: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private friendsService: FriendsService,
    private userService: UserService,
    private router: Router,
    private chatService: ChatService
  ) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.desktopView = false;
    }

    this.getFriends();
  }
  getFriends() {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.friends = response.data;
          console.log(this.friends);
          this.isLoading = false;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  changeRequestStatus(id, status) {
    this.isLoading = true;
    this.friendsService.changeRequestStatus({ id: id, status: status }).subscribe(
      (response) => {
        this.getFriends();

        this.selectedUser.status = response.status;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  moveToMessage(friend) {
    const friendID = friend.friend._id; //receiver ID
    const senderID = this.currentUser._id; //sender id

    this.chatService.createConversation(friendID, senderID).subscribe((response) => {
      if (response.status === 200) {
        if (response.data.message === 'Already chatGroup') {
          this.router.navigate(['/inbox', response.data.chatGroup]);
          return;
        } else {
          this.chatService.visitFriend(response.data._id).subscribe((response) => {
            if (response.status === 200) {
              this.router.navigate(['/inbox', response.data.chatGroup]);
            }
          });
        }
      }
    });
  }

  getConversationDetail(item1, item2) {
    this.chatService
      .getConservationDetails(item1, item2)
      .pipe(finalize(() => {}))
      .subscribe(
        (result) => {
          if (!result) {
            Swal.fire('', '', 'error');
          } else {
            localStorage.setItem('userID', result._id);
            localStorage.setItem('friendEmail', result.friendDetails.email);
            localStorage.setItem('friendUsername', result.friendDetails.userName);
          }
        },
        (error) => {
          Swal.fire('Internal Server Error', '', 'error');
        }
      );
  }
  preint() {
    console.log(this.selectedUser.requestBy.toString());
    console.log(this.currentUser._id.toString());
    console.log(this.selectedUser.requestBy.toString() === this.currentUser._id.toString());
  }

  onFriendClicked(friend, i) {
    console.log('clicked');
    console.log(friend, i);
    this.selectedUser = friend;

    this.selectedIndex = i;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 768) {
      this.desktopView = false;
      this.showCards = false;
    } else {
      this.desktopView = true;
      this.showCards = true;
      this.showList = true;
      this.showCard = false;

      this.desktopView = true;
    }
  }

  toggleView() {
    if (this.desktopView) {
      this.showCard = true;
      this.showCards = false;
    }
    if (!this.desktopView) {
      this.showList = false;
      this.showCard = true;
      this.showCards = false;
    }
  }

  toggeleView2() {
    if (this.desktopView) {
      this.showCard = false;
      this.showCards = true;
    }
    if (!this.desktopView) {
      this.showList = true;
      this.showCard = false;
      this.showCards = false;
    }
  }
}
