import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsService } from 'src/app/core/services/friends.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  friendsID: any;
  isLoading: boolean;
  friends: any = [];
  selectedUser: any = null;
  selectedIndex = 0;
  search = '';
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private friendsService: FriendsService
  ) {}
  users = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.friendsID = params['id'];
    });

    this.getFriends();
  }
  getFriends() {
    this.isLoading = true;
    this.friendsService.getFriends().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.selectedUser = response.data.filter((x) => x._id === this.friendsID)[0];

          this.friends = response.data;
          this.isLoading = false;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  changeRequestStatus(id, status) {
    let model = { id: id, status: status };
    this.isLoading = true;
    this.friendsService.changeRequestStatus(model).subscribe(
      (response) => {
        this.getFriends();
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
