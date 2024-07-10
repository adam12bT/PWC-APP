import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { Comment } from '../comment';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private selectedUserSubject = new BehaviorSubject<any | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api/';
  private accessToken: string = '';

  constructor(private http: HttpClient) { }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/login`, userData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token.access_token);
            this.setAccessToken(response.token.access_token);
          }
        }),
        catchError(this.handleError)
      );
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getUserDataByToken(): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + this.accessToken);
    return this.http.get<any>(`${this.apiUrl}users/getDataByToken`, { headers })
      .pipe(
        tap(
          userData => console.log('User data received:'),
          catchError(this.handleError)
        )
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}users/getall`).pipe(
      catchError(this.handleError)
    );
  }
  setSelectedUser(user: any): void {
    this.selectedUserSubject.next(user);
  }

  getSelectedUser(): any | null {
    return this.selectedUserSubject.getValue();
  }

  /*
  Uncomment this method if needed:
  
  changePassword(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + this.accessToken);
    return this.http.patch<any>(`${this.apiUrl}users/change-password`, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  */

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    // Clear accessToken on logout
    this.accessToken = '';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }
  createComment(postId: number, userId: number, content: string): Observable<Comment> {
    const commentPayload: Comment = {
      content: content,
      post: { id: postId },
      user: { id: userId }
    };
    return this.http.post<Comment>(`${this.apiUrl}posts/post/${postId}/user/${userId}`, commentPayload);
  }
}
