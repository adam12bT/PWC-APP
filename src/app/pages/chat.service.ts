import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SockJS from 'sockjs-client';
import { Client, Message, Stomp } from '@stomp/stompjs';
import { ChatMessage } from './chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]); // Initialize as empty array
  public messages$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.client = new Client();
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const WebSocketClass = SockJS;

    this.client.configure({
      webSocketFactory: () => new WebSocketClass('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.client.subscribe('/topic/messages', (message) => {
        const parsedMessage: ChatMessage = JSON.parse(message.body);
        console.log('WebSocket message received:', parsedMessage);
        
        // Update messageSubject with the new message
        const currentMessages = this.messageSubject.getValue();
        this.messageSubject.next([...currentMessages, parsedMessage]);
      });
    };

    this.client.onStompError = (frame) => {
      console.error(`Broker reported error: ${frame.headers['message']}`);
      console.error(`Additional details: ${frame.body}`);
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
      this.scheduleReconnect();
    };

    this.client.activate();
  }

  private scheduleReconnect() {
    console.log('Scheduling reconnection in 5 seconds...');
    setTimeout(() => {
      this.initializeWebSocket();
    }, 5000);
  }


  sendMessage(message: any) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/chat-message',
        body: JSON.stringify(message)
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  fetchMessages() {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/fetch-messages'
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>('http://localhost:8080/api/messages').pipe(
      map(messages => {
        this.messageSubject.next(messages);
        return messages;
      })
    );
  }
}
