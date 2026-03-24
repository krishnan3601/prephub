import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn()">
      <h2 style="color: var(--text-main)">PrepHub Admin</h2>
      <div style="display: flex; gap: 1rem;">
        <a routerLink="/questions" style="color: var(--text-main); line-height: 2; text-decoration: none;">Manage Questions</a>
        <button class="btn" (click)="logout()" style="padding: 0.4rem 1rem">Logout</button>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      padding: 1rem 2rem;
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
    }
  `]
})
export class AppComponent {
  router = inject(Router);

  isLoggedIn() {
    return !!localStorage.getItem('token') && localStorage.getItem('role') === 'admin';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
