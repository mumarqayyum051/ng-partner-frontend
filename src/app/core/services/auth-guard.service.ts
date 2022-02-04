import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //

    this.userService.isAuthenticated.subscribe((response) => {});
    if (!this.userService.authenticated) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
