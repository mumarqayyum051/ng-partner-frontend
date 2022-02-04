import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Toast } from '../@helpers/SwalToast';
import { ChatService } from '../core/services/chat.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {
  @ViewChild('scroller') private myScrollContainer: ElementRef;
  search = '';
  selectedIndex: string;
  showChats = false;
  openChat = false;
  page = 1;
  hasMorePages = true;
  totalDocs: Number;
  message = '';
  isChatLoad = true;
  items = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];

  users = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];
  currentUser: any;
  conversations: any = [];
  selectedConversation: any;
  messages: any = [];
  socket: any;
  endPoint = environment.socketURL;
  totalPages: any = 1;
  selectedConversationHeader: any;
  constructor(private chatService: ChatService, private userService: UserService, private route: ActivatedRoute) {
    this.onResize(null);
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.socket = io(this.endPoint);
    this.socket.on('connection');
    this.socket.emit('join', this.currentUser);
    this.socket.emit('join chat', this.currentUser);

    // this.getMessages(messageRecevied.chatID);

    this.getParams();
    this.socket.on('new message', (messageRecevied: any) => {
      if (messageRecevied.chatGroupID === this.selectedConversation) {
        this.getMessagesById(this.selectedConversation);
        this.scrollToBottom();
        this.getAllConversations();
        this.conversations.forEach((conversation) => {
          if (conversation._id === messageRecevied.chatGroupID) {
            this.selectedIndex = this.conversations.indexOf(conversation);
          }
        });
      } else {
        this.getAllConversations();
      }
    });
    this.socket.on('mark all as read', (chatInfo: any) => {
      console.log('here');
      if (this.selectedConversation === chatInfo.chatGroupID) {
        this.getMessagesById(chatInfo.chatGroupID);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    if (this.isChatLoad) {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    } else {
      // this.isChatLoad=true;
    }
  }

  getParams() {
    this.route.params.subscribe((params) => {
      this.selectedConversation = params.id;
      if (params.id) {
        this.getMessagesById(this.selectedConversation);
        this.getAllConversations();
      }

      if (!params.id) {
        this.getAllConversations();
      }
    });
  }

  getAllConversations() {
    this.chatService.getConversations(this.currentUser._id).subscribe((conversations) => {
      console.log(conversations);
      this.conversations = conversations.data.result;
      const firstConversation = this.conversations[0];
      if (firstConversation.user1._id !== this.currentUser._id) {
        localStorage.setItem('selectedUserID', firstConversation.user1._id);
      } else {
        localStorage.setItem('selectedUserID', firstConversation.user2._id);
      }
      if (!this.selectedConversation) {
        // this.selectedConversation = this.conversations[0]._id;
        this.selectedConversation = this.conversations[0]._id;
      }

      this.conversations.forEach((conversation) => {
        if (conversation._id === this.selectedConversation) {
          this.selectedIndex = this.conversations.indexOf(conversation);
        }
      });
      this.chatService.getMessages(this.selectedConversation).subscribe((messages) => {
        this.messages = messages.data.Chat.docs.reverse();
        this.totalPages = messages.data.Chat.totalPages;
        this.hasMorePages = messages.data.Chat.hasNextPage;
      });
    });
  }

  getMessagesById(chatGroupId) {
    this.chatService.getMessages(chatGroupId, this.page).subscribe((messages) => {
      this.messages = messages.data.Chat.docs.reverse();
    });
  }
  getUnseenMessages() {
    this.chatService.getUnseenMessages(this.selectedConversation, this.currentUser._id).subscribe((response) => {});
  }
  sendMessage() {
    const senderID = this.currentUser._id;
    const chatGroupID = this.selectedConversation;
    this.chatService.sendMessage(chatGroupID, this.message, senderID).subscribe((message) => {
      if (message.status === 200) {
        this.getMessagesById(this.selectedConversation);
        this.getAllConversations();
        this.scrollToBottom();
        this.markAllAsRead();
        this.isChatLoad = true;
        this.socket.emit('send message', {
          chatGroupID: chatGroupID,
          message: this.message,
          receiverID: localStorage.getItem('selectedUserID'),
        });

        this.message = '';
      }
    });
  }

  markAllAsRead() {
    this.chatService.markAllAsRead(this.selectedConversation, this.currentUser._id).subscribe((response) => {});
  }
  enterChat(conversation, i) {
    this.selectedConversation = conversation._id;
    this.selectedConversationHeader = conversation;
    console.log(conversation);
    this.getMessagesById(this.selectedConversation);
    if (conversation.user1._id !== this.currentUser._id) {
      localStorage.setItem('selectedUserID', conversation.user1._id);
    }
    if (conversation.user2._id !== this.currentUser._id) {
      localStorage.setItem('selectedUserID', conversation.user2._id);
    }
    //change unreadCount
    if (this.currentUser._id === this.conversations[i].user1._id) {
      this.conversations[i].user1Unread = 0;
      this.markAllAsRead();
      this.socket.emit('entered in the chat', {
        receiverID: this.conversations[i].user2._id,
        chatGroupID: this.selectedConversation,
      });
    }
    if (this.currentUser._id === this.conversations[i].user2._id) {
      this.conversations[i].user2Unread = 0;
      this.markAllAsRead();
      this.socket.emit('entered in the chat', {
        receiverID: this.conversations[i].user1._id,
        chatGroupID: this.selectedConversation,
      });
    }
    this.getUnseenMessages();
  }

  loadMore() {
    this.page++;

    this.isChatLoad = false;
    if (+this.page >= +this.totalPages) {
      Toast.fire({ title: 'No More Chat', icon: 'warning' });
      return;
    }

    this.getMessagesById(this.selectedConversation);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 768) {
      this.showChats = true;
      this.openChat = false;
    } else {
      this.showChats = true;
      this.openChat = true;
    }
  }

  toggleChat() {
    if (this.showChats && this.openChat) return;
    this.openChat = !this.openChat;
    this.showChats = !this.showChats;
  }
}
