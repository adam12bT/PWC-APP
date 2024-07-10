import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../chat-message.model';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface User {
  id: number;
  firstname: string | null;
  lastname: string | null;
  image: string; // Assuming you handle image as a string URL or base64 data in Angular

}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  message: string = '';

  private messageSubscription!: Subscription;
  private wsSubscription!: Subscription;
  users: User[] = [];
  chattedUsers: User[] = [];
  selectedUserId: number | null = null; // Track selected user ID
  selectedUserName: { firstname: string | null, lastname: string | null } | null = null; // Track selected user name
  loggedInUserId: number | undefined;
  user: any = {};

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getUserDataByToken().subscribe(
      (userData) => {
        this.loggedInUserId = userData.id;
        this.user=userData;
        this.subscribeToWebSocketMessages();
        this.fetchChattedUsers(); // Fetch the users with whom the logged-in user has chatted
      },
      (error) => {
        console.error('Error fetching logged-in user data:', error);
      }
    );

    this.authService.selectedUser$.subscribe((user: any) => {
      if (user) {
        this.selectedUserId = user.id;
        this.selectedUserName = { firstname: user.firstname, lastname: user.lastname }; // Set the selected user's name
      } 
    });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  fetchChattedUsers(): void {
    this.chatService.getAllMessages().subscribe(
      (messages: ChatMessage[]) => {
        const userIds = new Set<number>();
        messages.forEach(message => {
          if (message.senderId === this.loggedInUserId) {
            userIds.add(message.receiverId);
          } else if (message.receiverId === this.loggedInUserId) {
            userIds.add(message.senderId);
          }
        });
        
        this.authService.getAllUsers().subscribe(
          (users: User[]) => {
            this.users = users.filter(user => userIds.has(user.id));
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  subscribeToMessages(): void {
    if (this.selectedUserId) {
      this.messageSubscription = this.chatService.getAllMessages().subscribe(
        (messages: ChatMessage[]) => {
          console.log('HTTP messages received:', messages);
          this.filterAndSetMessages(messages);
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  subscribeToWebSocketMessages(): void {
    this.wsSubscription = this.chatService.messages$.subscribe(
      (messages: ChatMessage[]) => {
        console.log('WebSocket messages received:', messages);

        this.filterAndSetMessages(messages);
      },
      (error) => {
        console.error('Error receiving WebSocket messages:', error);
      }
    );
  }

  filterAndSetMessages(messages: ChatMessage[]): void {
    if (this.selectedUserId && this.loggedInUserId) {
      console.log('Filtering messages for:', this.loggedInUserId, this.selectedUserId);

      this.messages = messages.filter(message => {
        const isMatch =
          (message.senderId === this.loggedInUserId && message.receiverId === this.selectedUserId) ||
          (message.senderId === this.selectedUserId && message.receiverId === this.loggedInUserId);

        console.log(`Message Sender: ${message.senderId}, Receiver: ${message.receiverId}, Match: ${isMatch}`);
        return isMatch;
      });

      console.log('Filtered messages:', this.messages);
    } else {
      this.messages = [];
    }
  }

  sendMessage(): void {
    if (!this.selectedUserId || !this.loggedInUserId) {
      console.error('No user selected or logged-in user ID is missing');
      return;
    }

    const messagePayload = {
      senderId: this.loggedInUserId,
      receiverId: this.selectedUserId,
      content: this.message
    };

    this.chatService.sendMessage(messagePayload);
    this.message = '';
  }

  handleUserClick(user: User): void {
    console.log('Clicked user:', user);
    this.selectedUserId = user.id;
    this.selectedUserName = { firstname: user.firstname, lastname: user.lastname }; // Set the selected user's name
    this.subscribeToMessages();
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
}
