import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 80vh;">
      <div class="card" style="width: 350px;">
        <h2 style="text-align: center; margin-bottom: 1.5rem">Admin Login</h2>
        <p *ngIf="error" style="color: #ef4444; margin-bottom: 1rem; text-align: center;">{{ error }}</p>
        <form (ngSubmit)="onSubmit()">
          <input class="input-field" type="text" [(ngModel)]="username" name="username" placeholder="Username" required>
          <input class="input-field" type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
          <button class="btn" type="submit" style="width: 100%; margin-bottom: 1rem;">Log In</button>
          <p style="text-align: center; font-size: 0.9rem; margin-top: 1rem; color: var(--text-muted);">
            Don't have an admin account? <a routerLink="/signup" style="font-weight: 600; text-decoration: none;">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  api = inject(ApiService);
  router = inject(Router);

  onSubmit() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.role !== 'admin') {
          this.error = 'You must be an admin to access this dashboard.';
          return;
        }
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.router.navigate(['/questions']);
      },
      error: (err) => {
        this.error = 'Invalid credentials';
      }
    });
  }
}
