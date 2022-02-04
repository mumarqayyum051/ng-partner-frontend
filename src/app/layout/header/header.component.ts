import { Component, OnInit } from '@angular/core';
import { debounceTime, filter, finalize } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  currentRoute;

  constructor(private userService: UserService, private router: Router) {
    this.router.events.subscribe((res) => {
      this.currentRoute = this.router.url.split('/')[1];
    });
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
  }

  logout() {
    this.userService.logout();
    this.userService.purgeAuth();
    this.router.navigate(['/auth']);
  }
}
