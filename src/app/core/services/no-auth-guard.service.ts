import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userService.authenticated) {
      let user = this.userService.getCurrentUser()();
      if (user.isEmailVerified) {
        this.router.navigate(['/connect']);
      } else {
        this.userService.purgeAuth();
        this.router.navigate(['/auth']);
      }
      return false;
    }
    return true;
  }
}
