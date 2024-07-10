import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-card',
  templateUrl: './frinds.Component.html',
  styleUrls: ['./frinds.Component.css'],
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  standalone: true,
encapsulation:ViewEncapsulation.None
})
export class FrindsComponent implements OnInit {
  loggedInUserId: number | undefined;
  users: any[] = [];
  router  =  inject(Router);
  ChatComponent: any;
  selectedUserId: number | null = null; // Track selected user ID



  constructor(private userService: AuthService) { }

  ngOnInit(): void {
    // Use forkJoin to wait for both observables to complete
    forkJoin({
      userData: this.userService.getUserDataByToken(),
      allUsers: this.userService.getAllUsers()
    }).subscribe(
      ({ userData, allUsers }) => {
        this.loggedInUserId = userData.id;
        this.users = allUsers.filter(user => user.id !== this.loggedInUserId);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
    handleButtonClick(user: any): void {
      console.log('Selected User:', user);
      this.userService.setSelectedUser(user);
  
      this.router.navigate(['/chat']); // Navigate to chat with selected user ID
    
}
}


