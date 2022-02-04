import { Component, OnInit } from '@angular/core';
import { Toast } from '../@helpers/SwalToast';
import { FriendsService } from '../core/services/friends.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent implements OnInit {
  public isMenuCollapsed = false;
  isLoading = false;
  connects: any = [];
  selectedUser: any;
  items = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];
  currentUser: any;
  friends: any = [];
  previouslySelectedUser: any;
  disableIcons: boolean = false;

  constructor(private userService: UserService, private friendsService: FriendsService) {}

  ngOnInit(): void {
    console.log(this.isLoading);
    this.currentUser = this.userService.getCurrentUser();
    this.getFriends(); //get friends of current user
  }
  getConnects() {
    this.isLoading = true;
    this.userService.getConnects().subscribe(
      (response) => {
        if (response.data.length > 0) {
          response.data = response.data.filter((x: any) => x._id !== this.currentUser._id);

          if (this.friends.length > 0) {
            this.friends.forEach((friend: any) => {
              response.data.forEach((connect: any) => {
                if (connect._id === friend.friend._id) {
                  let index = response.data.indexOf(connect);

                  if (index === -1) {
                  }
                  if (index === response.data.length - 1) {
                    response.data.splice(-1);
                  } else if (index === -1) {
                  } else {
                    response.data.splice(index, 1);
                  }
                }
              });
            });
          } else {
          }
          console.log(response.data);
          response.data = this.shuffleConnects(response.data);
          console.log(response.data);
          response.data = response.data.slice(0, 9);
          console.log(response.data);
          if (response.data.length > 0) {
            if (this.previouslySelectedUser && this.previouslySelectedUser._id === response.data[0]._id) {
              console.log('inside if');
              if (response.data.length === 1) {
                this.selectedUser = response.data[0];
              } else {
                response.data.forEach((element) => {
                  if (element._id !== this.previouslySelectedUser._id) {
                    this.selectedUser = element;
                    this.previouslySelectedUser = this.selectedUser;
                  }
                });
              }
            } else {
              console.log('inside else');
              this.selectedUser = response.data[0];
              this.previouslySelectedUser = this.selectedUser;
            }

            this.connects = response.data.filter((x: any) => x._id !== this.selectedUser._id);
            this.disableIcons = false;
          } else {
            this.connects = response.data;
            this.disableIcons = false;
          }
          console.log(this.connects);
          // this.connects = response.data;
          this.isLoading = false;
        }
        console.log(this.selectedUser);
      },
      (err) => {
        this.disableIcons = false;

        this.isLoading = false;
      }
    );
  }

  getFriendsWithDelay() {
    this.disableIcons = true;
    setTimeout(() => {
      this.getFriends();
    }, 300);
  }

  getFriends() {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe(
      (response) => {
        this.getConnects();
        this.friends = response.data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  updateCard(i: any) {
    this.selectedUser = this.connects[i];
  }
  arrRotateLeft = (arr, count = 0) => {
    return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
  };
  rotateArray(arr, reverse) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
    // console.log(arr);
  }
  shuffleConnects(arr: any) {
    var len = arr.length;
    var d = len;
    var array = [];
    var k, i;
    for (i = 0; i < d; i++) {
      k = Math.floor(Math.random() * len);
      array.push(arr[k]);
      console.log(k, 1);
      arr.splice(k, 1);
      len = arr.length;
    }
    for (i = 0; i < d; i++) {
      arr[i] = array[i];
    }
    return arr;
  }

  sendRequestWithDelay() {
    this.disableIcons = true;
    setTimeout(() => {
      this.sendRequest();
    }, 300);
  }
  sendRequest() {
    this.isLoading = true;
    this.friendsService.addFriend(this.selectedUser._id).subscribe(
      (response) => {
        Toast.fire({ title: 'Request Sent', icon: 'success' });
        this.selectedUser = null;
        this.getFriends();
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
