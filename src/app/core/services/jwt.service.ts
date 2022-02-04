import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  getToken(): String {
    return window.localStorage['ngPartneur'];
  }

  saveToken(token: String) {
    window.localStorage['ngPartneur'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('ngPartneur');
  }
}
