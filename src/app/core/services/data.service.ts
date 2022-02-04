import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  getUserLoggedIn = this.userLoggedIn.asObservable();
  constructor() {}

  changeUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }
}
