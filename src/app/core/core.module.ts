import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpTokenInterceptor } from './interceptors';
import { ApiService } from './services/api.service';
import { AuthGuard } from './services/auth-guard.service';
import { ChatService } from './services/chat.service';
import { DataService } from './services/data.service';
import { FriendsService } from './services/friends.service';
import { JwtService } from './services/jwt.service';
import { NoAuthGuard } from './services/no-auth-guard.service';
import { SocketService } from './services/socket.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    JwtService,
    UserService,
    FriendsService,
    ChatService,
    AuthGuard,
    NoAuthGuard,
    SocketService,
    DataService,
  ],
})
export class CoreModule {}
