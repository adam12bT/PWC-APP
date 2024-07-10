import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Post } from '../../post';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../service/postservice';
import { AuthService } from '../../service/auth.service';
import { Comment } from '../../comment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../user';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit {
  comment: string = '';
  postId!: number;
  userId!: number;
  commentt = {} as Comment;
  posts: Post[] = [];
  content: string = '';
  contents: string = '';
  image: File | null = null;
  user: any = {};
  showNotifications: boolean = false;
  userpost: any;
  postdata: Post[] | undefined;
  filteredUsers: User[] = [];
  searchQuery: string = '';
  router  =  inject(Router);

  constructor(
    private httpClient: HttpClient,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserDataByToken().subscribe(
      (userData) => {
        this.user = userData;
        console.log(userData);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe(
      (posts) => {
        console.log('API Response:', posts);  // Log the raw API response
  
        if (posts && posts.length > 0) {
          this.posts = posts.sort((a, b) => b.id - a.id);
          console.log('Sorted posts:', this.posts);
  
          this.postdata = posts;
          console.log('Post data:', this.postdata[1].user);
  
          if (this.postdata[1]) {
            console.log('User of second post:', this.postdata[1].user);
          } else {
            console.log('Second post does not exist.');
          }
        } else {
          console.log('No posts available.');
        }
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }
  
  

  onFileSelected(event: any): void {
    this.image = event.target.files[0];
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onSubmit(): void {
    if (this.content !== '' || this.image !== null) {
      this.postService.createPost(this.content, this.image).subscribe(
        (post) => {
          this.posts.unshift(post);
          this.content = '';
          this.image = null;
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    } else if (this.image) {
      this.postService.createPost('', this.image).subscribe(
        (post) => {
          this.posts.unshift(post);
          this.content = '';
          this.image = null;
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
  }

  createComment(postId: number): void {
    this.authService.getUserDataByToken().subscribe(
      (userData) => {
        this.userId = userData.id;

        if (!this.comment) {
          console.error('Comment content is missing');
          return;
        }

        const selectedPost = this.posts.find(post => post.id === postId);

        if (!selectedPost) {
          console.error('Post not found with postId:', postId);
          return;
        }

        this.authService.createComment(postId, this.userId, this.comment).subscribe(
          (response) => {
            console.log('Comment created:', response);
            this.comment = '';
            this.loadPosts();
          },
          (error) => {
            console.error('Error creating comment:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching user data for comment:', error);
      }
    );
  }
  handleButtonClick(user: User): void {
    console.log('Selected User:', user);
    this.authService.setSelectedUser(user);
    this.router.navigate(['/chat']);
  }
  fetchUserData(): void {
    this.authService.getUserDataByToken().subscribe(
      userData => {
        this.userId = userData.id;
        this.user=userData;
        console.log('User ID:', this.userId);
        console.log('uuserrrrrr',userData)
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }
   

   
  filterUsers(): void {
    if (this.searchQuery.trim() !== '') {
      this.authService.getUserDataByToken().subscribe(
        userData => {
          this.userId = userData.id;
          this.authService.getAllUsers().subscribe(
            users => {
              console.log('Users fetched:', users);
              this.filteredUsers = users.filter(user =>
                user.id !== this.userId &&
                (user.firstname?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                user.lastname?.toLowerCase().includes(this.searchQuery.toLowerCase()))
              );
            },
            error => {
              console.error('Error loading users:', error);
            }
          );
        },
        error => {
          console.error('Error fetching user data by token:', error);
        }
      );
    } else {
      this.filteredUsers = [];
    }
  }
}
