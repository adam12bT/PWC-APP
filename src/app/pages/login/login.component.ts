import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user !:User;

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  httpClient: any;

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        
        (response: any) => {
          console.log('Login response:', response); 
          localStorage.setItem("token", response.access_token);

          if (this.authService.isLoggedIn()) {
            localStorage.setItem("token", response.access_token);
  
            this.authService.getUserDataByToken().subscribe(
              (result: any) => {
                console.log('User data:', result); // Log user data here
      
                this.router.navigate(['/feed']); // Navigate after obtaining user data
              },
              error => {
                console.error('Error fetching user data:', error);
                // Handle error in fetching user data
              }
            );
          } else {
            console.log('User not logged in');
          }
        },
        error => {
          console.error('Login error:', error);
  
          if (error.status === 409 && error.error.error === 'Email not found') {
            alert('Email not found. Please check your email and try again.');
          } else {
            alert('Login failed. Please try again later.');
          }
        }
      );
    }
  }






}  