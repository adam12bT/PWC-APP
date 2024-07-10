import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Post } from '../post';
import { User } from '../user';
import { AuthService } from './auth.service';
 
@Injectable({
  providedIn: 'root'
})
 
 
export class PostService {
  private baseUrl = 'http://localhost:8080/api/posts';
 
  constructor(private http: HttpClient , private auth:AuthService) { }
 
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }
 
  createPost(content: string | null, image: File | null): Observable<Post> {
    return this.auth.getUserDataByToken().pipe(
      switchMap((user: User) => {
        const formData: FormData = new FormData();
       
        // Ajouter le contenu s'il est fourni
        if (content !== null && content !== undefined && content !== '') {
          formData.append('content', content);
        }
       
        if (image !== null && image !== undefined) {
          formData.append('image', image, image.name);
        }
       
        formData.append('user', JSON.stringify(user));
 
        return this.http.post<Post>(this.baseUrl, formData);
      })
    );
  }
}
