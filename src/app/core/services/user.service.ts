import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  cookieExists: any;

  constructor(private cookieService: CookieService, private apiService: ApiService, private jwtService: JwtService) {}
  public get authenticated() {
    return this.isAuthenticatedSubject.value;
  }

  cont() {
    //
    return this.apiService.get('/user/context');
  }
  contextPopulate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      return this.apiService.get('auth/verify_auth_token').pipe(
        map((res) => {
          this.setCurrentUser(res);
          return res;
        }),
        catchError((e) => {
          this.purgeAuth();
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('auth/verify_auth_token').subscribe(
        (data) => this.setCurrentUser(data),
        (err) => {
          this.purgeAuth();
        }
      );
    } else {
      // Remove any potential remnants of previous auth states

      this.purgeAuth();
    }
  }

  setCurrentUser(user) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }
  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.setCurrentUser(user.user);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as any);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  signUp(user: any): Observable<any> {
    return this.apiService.post('auth/register', user).pipe(
      map((data) => {
        this.setAuth(data);
        return data;
      })
    );
  }

  forgotPassword(user: any): Observable<any> {
    return this.apiService.post('auth/forgot_password', user).pipe(
      map((data) => {
        return data;
      })
    );
  }

  resetPassword(user: any): Observable<any> {
    return this.apiService.post('auth/reset_password', user).pipe(
      map((data) => {
        return data;
      })
    );
  }

  attemptAuth(credentials, cookieExists): Observable<any> {
    this.cookieExists = cookieExists;
    if (credentials && credentials.rememberMe) {
      if (this.cookieExists) {
        this.cookieService.delete('partneur', '/');
      }
      var d = new Date();
      d.setTime(d.getTime() + 15 * 24 * 60 * 60 * 1000);
      let cook = {
        email: credentials.email,
        password: credentials.password,
      };
      this.cookieService.set('partneur', btoa(JSON.stringify(cook)), d, '/');
    } else {
      this.cookieService.delete('partneur', '/');
    }

    return this.apiService.post('auth/login', credentials).pipe(
      map((data) => {
        this.setAuth(data);

        return data;
      })
    );
  }
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  updateProfile(profile, id) {
    return this.apiService.patch(`users/${id}`, profile).pipe(
      map((data: any) => {
        this.setCurrentUser(data);
      })
    );
  }
  uploadFile(fileData) {
    return this.apiService.postFile('files/upload', fileData).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getConnects(): Observable<any> {
    return this.apiService.get('users');
  }
  logout() {
    this.purgeAuth();
  }
}
