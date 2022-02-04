import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable()
export class ChatService {
  constructor(private http: HttpClient, private apiService: ApiService, private socketService: SocketService) {}

  getChatMessages(model): Observable<any> {
    let userID = localStorage.getItem('userID');
    let params = new HttpParams()
      .set('conversationId', userID)
      .set('cursor', model ? model.cursor : null)
      .set('limit', '10');
    let onSuccess = (value) => {
      let data = value;
      if (data.token) {
        const result = data;
      }
      return data;
    };
    return this.apiService.get('messages', params).pipe(map(onSuccess));
  }

  getConservationDetails(participant1, participant2) {
    let participant_list = [participant1, participant2];

    let params = new HttpParams();
    params = params.append('participants', JSON.stringify(participant_list));

    let onSuccess = (value) => {
      let data = value;
      if (data.token) {
        const result = data;
      }
      return data;
    };
    return this.apiService.get('conversations/details', params).pipe(map(onSuccess));
  }

  getMessage() {
    let params = new HttpParams().set('cursor', null).set('limit', '10');
    let onSuccess = (value) => {
      let data = value;
      if (data.token) {
        const result = data;
      }
      return data;
    };
    return this.apiService.get('conversations', params).pipe(map(onSuccess));

    // return this.service(this.get(APIPaths.getMessage, params))
    //   .pipe(
    //     map(value => this.processPayload(value)),
    //     map(onSuccess)
    //   );
  }
  deleteConversation(id) {
    let onSuccess = (value) => {
      let data = value;
      if (data.token) {
        const result = data;
      }
      return data;
    };
    return this.apiService.delete('conversations' + id).pipe(map(onSuccess));
  }
  getConversationEvent(currentUserId: string) {
    return this.socketService.onEvent('conversation' + currentUserId);
  }
  getChatUsers() {
    return this.apiService.get(`/chat/users`);
  }
  getHistoryAndUser(id: any, params: any) {
    return this.apiService.get(`/chat/${id}?${params}`);
  }

  createConversation(receiverID, senderID): Observable<any> {
    return this.apiService.post(`conversations/addChatGroup/${receiverID}/${senderID}`, {});
  }

  visitFriend(chatID): Observable<any> {
    return this.apiService.put(`conversations/visit/${chatID}`, {});
  }

  sendMessage(chatGroupID, content, senderID): Observable<any> {
    return this.apiService.post(`conversations/addChat/${chatGroupID}/${senderID}`, { text: content });
  }

  getConversations(currentUserId): Observable<any> {
    return this.apiService.get(`conversations/chatGroups/${currentUserId}`);
  }

  getMessages(chatGroupID, page = 1): Observable<any> {
    return this.apiService.get(`conversations/chatMessages/${chatGroupID}?page=${page}`);
  }

  markAllAsRead(chatGroupID, currentUserId): Observable<any> {
    return this.apiService.put(`conversations/chatMessages/markRead/${chatGroupID}/${currentUserId}`, {});
  }

  getUnseenMessages(chatGroupID, currentUserId): Observable<any> {
    return this.apiService.get(`conversations/chatMessages/getUnseen/${chatGroupID}/${currentUserId}`);
  }
}
