import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class FriendsService {
  constructor(private apiService: ApiService) {}

  addFriend(id): Observable<any> {
    return this.apiService.post('friends/send_friend_request', { friendId: id });
  }
  getFriends(): Observable<any> {
    return this.apiService.get('friends');
  }
  getFriend(id): Observable<any> {
    return this.apiService.get('friends/' + id);
  }
  changeRequestStatus(friend): Observable<any> {
    return this.apiService.put('friends/change_request_status', friend);
  }
}
