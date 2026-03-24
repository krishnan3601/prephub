# 📘 PrepHub – Admin Module: Full Explanation

This document explains every file in the `admin-app` (Angular-based admin dashboard) of the PrepHub project, line by line.

---

## 📁 Project Structure Overview

```
admin-app/
└── src/
    └── app/
        ├── app.component.ts        ← Root component (Navbar + Router outlet)
        ├── app.config.ts           ← App-wide Angular providers/config
        ├── app.routes.ts           ← URL routing definitions
        ├── services/
        │   └── api.service.ts      ← All HTTP calls to the backend
        └── components/
            ├── login/              ← Admin login page
            ├── signup/             ← Admin signup page
            ├── question-list/      ← View/Delete all questions
            └── question-form/      ← Add or Edit a question
```

---

## 🔧 Technology Used

- **Angular (Standalone Components)** – A modern frontend framework by Google.
- **TypeScript** – A typed superset of JavaScript.
- **HttpClient** – Angular's built-in module for making API calls.
- **Angular Signals** – Reactive state management (replaces simple arrays).
- **RouterModule** – Angular's client-side navigation system.

---

---

# 1️⃣ `app.config.ts` — Application Bootstrap Configuration

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()]
};
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { ApplicationConfig }` | Imports the type that describes an Angular app's configuration object. |
| 2 | `import { provideRouter }` | Imports a function that sets up Angular's routing system for the app. |
| 3 | `import { provideHttpClient }` | Imports a function that enables HTTP communication (so you can make API calls). |
| 5 | `import { routes }` | Brings in the route definitions from `app.routes.ts`. |
| 7-9 | `export const appConfig` | Exports the config object. `provideRouter(routes)` enables routing; `provideHttpClient()` enables HTTP requests across the whole app. |

> **Think of this file as the "startup checklist" for the Angular app.** Before the app loads even a single page, Angular reads this file to know: which routes exist, and how to make API calls.

---

---

# 2️⃣ `app.routes.ts` — URL Routing Definitions

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionFormComponent } from './components/question-form/question-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'questions', component: QuestionListComponent },
  { path: 'questions/add', component: QuestionFormComponent },
  { path: 'questions/edit/:id', component: QuestionFormComponent }
];
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { Routes }` | Brings in Angular's `Routes` type — it's an array of route objects. |
| 2-5 | Imports | Loads every component so we can assign them to URLs. |
| 8 | `path: '', redirectTo: '/login'` | When the user visits the root URL `/`, they are automatically redirected to `/login`. `pathMatch: 'full'` means the ENTIRE URL must be empty (not just starting with `/`). |
| 9 | `path: 'login'` | The `/login` URL shows the `LoginComponent`. |
| 10 | `path: 'signup'` | The `/signup` URL shows the `SignupComponent`. |
| 11 | `path: 'questions'` | The `/questions` URL shows the full list of questions. |
| 12 | `path: 'questions/add'` | The `/questions/add` URL opens the blank "Add Question" form. |
| 13 | `path: 'questions/edit/:id'` | The `/questions/edit/abc123` URL opens the form pre-filled for editing. The `:id` is a **dynamic segment** — it can be any question's database ID. |

> **Think of this file as the app's "table of contents."** Each URL maps to a specific page/component.

---

---

# 3️⃣ `app.component.ts` — Root Component (Shell / Navbar)

```typescript
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
        <a routerLink="/questions" style="...">Manage Questions</a>
        <button class="btn" (click)="logout()" style="...">Logout</button>
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
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { Component, inject }` | `Component` marks a class as an Angular component. `inject()` is a modern way to get services without a constructor. |
| 2 | `import { CommonModule }` | Enables Angular directives like `*ngIf`, `*ngFor` in the template. |
| 3 | `import { RouterModule, Router }` | `RouterModule` gives `routerLink` and `<router-outlet>`. `Router` lets you navigate programmatically. |
| 5-6 | `selector: 'app-root'` | This is the "tag name" used in `index.html` as `<app-root></app-root>` — the entry point of the app. |
| 7 | `standalone: true` | This component doesn't need an NgModule. It is self-contained. |
| 10 | `*ngIf="isLoggedIn()"` | The navbar is **only shown if the user is logged in as admin**. If not logged in, the entire `<nav>` is hidden. |
| 11 | `PrepHub Admin` | Simple brand name shown in the top-left of the navbar. |
| 13 | `routerLink="/questions"` | Clicking "Manage Questions" navigates to the `/questions` page without a full page reload. |
| 14 | `(click)="logout()"` | Calls the `logout()` method when the Logout button is clicked. |
| 18 | `<router-outlet>` | This is the **placeholder** where all route components are rendered. When you go to `/login`, the `LoginComponent` renders here. |
| 32 | `router = inject(Router)` | Gets Angular's Router service using the modern `inject()` function. |
| 34-36 | `isLoggedIn()` | Checks localStorage for a `token` AND confirms the `role` is `'admin'`. `!!` converts the value to a boolean (true/false). |
| 38-42 | `logout()` | Removes the auth `token` and `role` from localStorage, then redirects the user to `/login`. |

> **This is the "shell" of the app.** Every page is loaded inside the `<router-outlet>`. The navbar appears on top of every page, but only when the user is authenticated as admin.

---

---

# 4️⃣ `api.service.ts` — Backend Communication Service

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';
  
  questions = signal<any[]>([]);
  topicRequests = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  fetchTopicRequests() {
    this.http.get<any[]>(`${this.baseUrl}/topicRequests`, { headers: this.getHeaders() }).subscribe(data => {
      this.topicRequests.set(data);
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchQuestions() {
    this.http.get<any[]>(`${this.baseUrl}/questions`).subscribe(data => {
      this.questions.set(data);
    });
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(credentials: any) {
    return this.http.post(`${this.baseUrl}/register`, credentials);
  }

  addQuestion(question: any) {
    return this.http.post(`${this.baseUrl}/addQuestion`, question, { headers: this.getHeaders() });
  }

  updateQuestion(id: string, question: any) {
    return this.http.put(`${this.baseUrl}/update/${id}`, question, { headers: this.getHeaders() });
  }

  deleteQuestion(id: string) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { Injectable, signal }` | `Injectable` allows this class to be injected into components. `signal` is Angular's reactive state primitive. |
| 2 | `import { HttpClient, HttpHeaders }` | `HttpClient` makes HTTP requests. `HttpHeaders` lets you attach headers (like auth tokens). |
| 4-6 | `@Injectable({ providedIn: 'root' })` | Makes this service a **singleton** — one shared instance for the entire app. |
| 8 | `private baseUrl` | The backend server URL. All API calls are relative to this. `private` means only this service can use it directly. |
| 10 | `questions = signal<any[]>([])` | A reactive "signal" holding the array of questions. When this updates, any component using it automatically re-renders. Starts as empty `[]`. |
| 11 | `topicRequests = signal<any[]>([])` | Same concept — holds topic requests made by students. |
| 13 | `constructor(private http: HttpClient)` | Angular injects the `HttpClient` instance here so we can use it throughout the service. |
| 15-19 | `fetchTopicRequests()` | Makes a GET request to `/api/topicRequests` with auth headers. On success, updates the `topicRequests` signal with the returned data. |
| 21-24 | `getHeaders()` | Reads the JWT token from localStorage and wraps it in an `Authorization: Bearer <token>` header. This header is required by protected backend routes. |
| 26-30 | `fetchQuestions()` | Makes a GET request to `/api/questions` (no auth needed — public). Updates the `questions` signal. |
| 32-34 | `login(credentials)` | Sends a POST request with `{ username, password }` to `/api/login`. Returns an Observable (the component subscribes to it). |
| 36-38 | `register(credentials)` | Sends a POST request to `/api/register`. Used by the signup page. |
| 40-42 | `addQuestion(question)` | Sends a POST request with question data to add a new question. Requires auth headers. |
| 44-46 | `updateQuestion(id, question)` | Sends a PUT request to `/api/update/:id`. Updates an existing question by its MongoDB `_id`. |
| 48-50 | `deleteQuestion(id)` | Sends a DELETE request to `/api/delete/:id`. Removes a question by its ID. |

> **This is the "data layer" of the admin app.** All components use this single service to talk to the backend. It keeps HTTP logic in one place (separation of concerns).

---

---

# 5️⃣ `login.component.ts` — Admin Login Page

```typescript
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
        <p *ngIf="error" style="color: #ef4444; ...">{{ error }}</p>
        <form (ngSubmit)="onSubmit()">
          <input class="input-field" type="text" [(ngModel)]="username" name="username" placeholder="Username" required>
          <input class="input-field" type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
          <button class="btn" type="submit" style="width: 100%; ...">Log In</button>
          <p style="...">
            Don't have an admin account? <a routerLink="/signup">Sign Up</a>
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
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 3 | `import { FormsModule }` | Enables `[(ngModel)]` two-way data binding in templates. Needed for form inputs. |
| 9 | `standalone: true` | No NgModule needed. Self-contained component. |
| 10 | `imports: [CommonModule, FormsModule, RouterModule]` | `CommonModule` = `*ngIf`. `FormsModule` = `[(ngModel)]`. `RouterModule` = `routerLink`. |
| (template) | `justify-content: center; align-items: center; height: 80vh` | Centers the login card both horizontally and vertically on the page. |
| (template) | `*ngIf="error"` | Only shows the error paragraph if `error` is a non-empty string. |
| (template) | `{{ error }}` | Interpolation — displays the value of the `error` variable inside the paragraph. |
| (template) | `(ngSubmit)="onSubmit()"` | When the form is submitted (Enter key or button click), calls `onSubmit()`. |
| (template) | `[(ngModel)]="username"` | Two-way binding — as the user types in the input, `this.username` updates in real time. |
| 29 | `username = ''` | Stores whatever the user types in the username field. |
| 30 | `password = ''` | Stores the typed password. |
| 31 | `error = ''` | Starts as empty. Set to an error message string if login fails. |
| 32 | `api = inject(ApiService)` | Gets the shared ApiService. |
| 33 | `router = inject(Router)` | Gets the Router to navigate after login. |
| 36 | `this.api.login({...}).subscribe({...})` | Makes the login HTTP call. `.subscribe()` listens for the result asynchronously. |
| 38-40 | `if (res.role !== 'admin')` | **Security check** — even if login succeeds, if the user is NOT an admin, access is denied. |
| 42-43 | `localStorage.setItem(...)` | Saves the JWT token and role to the browser's localStorage for future requests. |
| 44 | `this.router.navigate(['/questions'])` | Redirects the admin to the questions dashboard on successful login. |
| 46-48 | `error: (err) =>` | If the HTTP call fails (wrong password, user not found), sets `error` to display the message. |

---

---

# 6️⃣ `signup.component.ts` — Admin Sign-Up Page

```typescript
export class SignupComponent {
  username = '';
  password = '';
  error = '';
  api = inject(ApiService);
  router = inject(Router);

  onSubmit() {
    this.api.register({ username: this.username, password: this.password, role: 'admin' }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.router.navigate(['/questions']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Signup failed';
      }
    });
  }
}
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| Properties | `username`, `password`, `error` | Same as login — bind to the form inputs. |
| `onSubmit()` | Called on form submit. | Calls `api.register()` to create a new admin account. |
| `role: 'admin'` | **Hard-coded admin role** | The signup form always registers users as `admin`. This means only admin accounts can be created via this form. |
| `localStorage.setItem(...)` | Token & role stored | After registration, the user is immediately logged in (token saved) and redirected to `/questions`. |
| `err.error?.error` | Optional chaining (`?.`) | Safely reads the `error` property from the server's error response. If not present, falls back to `'Signup failed'`. |

> **The key difference from Login:** Signup sends `role: 'admin'` in the request body, explicitly creating an admin-level account.

---

---

# 7️⃣ `question-list.component.ts` — View & Manage Questions

```typescript
export class QuestionListComponent implements OnInit {
  api = inject(ApiService);
  filterDiff = 'all';
  sortOrder = 'asc';

  ngOnInit() {
    this.api.fetchQuestions();
    this.api.fetchTopicRequests();
  }

  get filteredAndSortedQuestions() {
    let questions = this.api.questions();
    if (this.filterDiff !== 'all') {
      questions = questions.filter(q => q.difficulty === this.filterDiff);
    }
    return questions.sort((a, b) => {
      if (this.sortOrder === 'asc') return a.title.localeCompare(b.title);
      else return b.title.localeCompare(a.title);
    });
  }

  deleteQuestion(id: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.api.deleteQuestion(id).subscribe(() => {
        this.api.fetchQuestions();
      });
    }
  }
}
```

### Line-by-Line Explanation (Class)

| Line | Code | Explanation |
|------|------|-------------|
| `implements OnInit` | Lifecycle hook | The class promises to have an `ngOnInit()` method, which Angular calls right after the component loads. |
| `filterDiff = 'all'` | Filter state | Bound to the difficulty dropdown. Default is `'all'` (show everything). |
| `sortOrder = 'asc'` | Sort state | Bound to the sort dropdown. Default is alphabetical A→Z. |
| `ngOnInit()` | Called on load | Immediately fetches all questions and topic requests from the backend when the page opens. |
| `get filteredAndSortedQuestions` | Computed getter | A `get` property is like a computed value — called without `()` in the template. Every time it's accessed, it re-runs. |
| `this.api.questions()` | Signal read | Calling a signal like a function `()` reads its current value. |
| `questions.filter(...)` | Difficulty filter | If a filter is selected, only questions matching that difficulty pass through. |
| `questions.sort(...)` | Alphabetical sort | `localeCompare` compares strings correctly for alphabetical ordering. Reversed for Z→A. |
| `deleteQuestion(id)` | Delete handler | Shows a browser confirmation dialog. If confirmed, calls the API to delete, then re-fetches the list. |

### Line-by-Line Explanation (Template Highlights)

| Template Part | Explanation |
|---------------|-------------|
| `*ngIf="api.topicRequests().length > 0"` | Shows the yellow notification banner only if students have requested topics. |
| `*ngFor="let req of api.topicRequests()"` | Loops over all topic requests and renders them as a list. |
| `req.count` | The number of students who requested that topic. |
| `[(ngModel)]="filterDiff"` | Two-way bound to the difficulty dropdown — changes `filterDiff` in real time. |
| `[(ngModel)]="sortOrder"` | Two-way bound to the sort dropdown. |
| `*ngFor="let q of filteredAndSortedQuestions"` | Loops the already-filtered and sorted list (uses the getter). |
| `*ngIf="q.isImportant"` | Shows a ★ star only beside questions marked as important. |
| `[routerLink]="['/questions/edit', q._id]"` | Dynamic route — clicking Edit navigates to `/questions/edit/<that question's ID>`. |
| `(click)="deleteQuestion(q._id)"` | Calls delete with that specific question's database ID. |

---

---

# 8️⃣ `question-form.component.ts` — Add / Edit Question Form

```typescript
export class QuestionFormComponent implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEdit = false;
  questionId: string | null = null;
  question: any = {
    title: '',
    description: '',
    difficulty: 'easy',
    tags: [],
    isImportant: false
  };

  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    if (this.questionId) {
      this.isEdit = true;
      const existing = this.api.questions().find(q => q._id === this.questionId);
      if (existing) {
        this.question = { ...existing };
      } else {
        this.api.fetchQuestions();
        setTimeout(() => {
          const loaded = this.api.questions().find(q => q._id === this.questionId);
          if (loaded) this.question = { ...loaded };
        }, 500);
      }
    }
  }

  onSubmit() {
    if (this.isEdit && this.questionId) {
      this.api.updateQuestion(this.questionId, this.question).subscribe(() => {
        this.router.navigate(['/questions']);
      });
    } else {
      this.api.addQuestion(this.question).subscribe(() => {
        this.router.navigate(['/questions']);
      });
    }
  }
}
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| `route = inject(ActivatedRoute)` | Gets the current route info | Used to read URL parameters like the `id` in `/questions/edit/abc123`. |
| `isEdit = false` | Mode flag | Starts as `false` (Add mode). Becomes `true` if an ID is found in the URL. |
| `questionId: string \| null` | Type union | Either a string ID or `null` if we're adding (not editing). |
| `question: any = {...}` | Form model | Default empty question object. Each field is bound with `[(ngModel)]` to the form inputs. |
| `this.route.snapshot.paramMap.get('id')` | Read URL param | Reads the `:id` value from the URL. Returns `null` if there is no `:id` (i.e., Add mode). |
| `if (this.questionId)` | Edit mode detection | If an ID exists in the URL, we're editing. |
| `this.isEdit = true` | Switch to edit mode | Changes form heading from "Add" to "Edit" and button from "Save" to "Update". |
| `this.api.questions().find(q => q._id === this.questionId)` | Find in memory | Searches the already-loaded questions signal for a match. Avoids an extra API call. |
| `this.question = { ...existing }` | Spread operator | Creates a **copy** of the existing question so edits don't directly mutate the signal state. |
| `this.api.fetchQuestions()` + `setTimeout(...)` | Fallback fetch | If the user refreshes directly on the edit page, the signal is empty. So it re-fetches and waits 500ms before populating the form. |
| `onSubmit()` | Form submission | Decides: if editing → call `updateQuestion`, else → call `addQuestion`. After success, go back to `/questions`. |

### Template Highlights

| Template Part | Explanation |
|---------------|-------------|
| `{{ isEdit ? 'Edit' : 'Add' }} Question` | Ternary operator — shows "Edit Question" or "Add Question" as the heading. |
| `[(ngModel)]="question.title"` | Binds the title input to `question.title`. Typing changes the object in real time. |
| `<textarea [(ngModel)]="question.description">` | Multi-line description field, same binding pattern. |
| `<select [(ngModel)]="question.difficulty">` | Dropdown bound to `question.difficulty`. Options are easy / medium / hard. |
| `<input type="checkbox" [(ngModel)]="question.isImportant">` | Checkbox. When checked, `question.isImportant` becomes `true`. |
| `{{ isEdit ? 'Update' : 'Save' }} Question` | Button label also changes based on mode. |
| `routerLink="/questions"` on Cancel | Goes back to the list without saving. |

---

---

# 🔄 Complete Data Flow Summary

```
User opens /login
     │
     ▼
LoginComponent → ApiService.login() → POST /api/login
     │                                       │
     │                   Backend returns { token, role }
     ▼
localStorage.setItem('token') + localStorage.setItem('role')
     │
     ▼
Navigate to /questions
     │
     ▼
QuestionListComponent.ngOnInit()
     │
     ├─ ApiService.fetchQuestions()   → GET /api/questions
     └─ ApiService.fetchTopicRequests() → GET /api/topicRequests (with token)
     │
     ▼
Display filtered/sorted question list + topic request banner

Admin clicks "+ Add Question"
     │
     ▼
Navigate to /questions/add
QuestionFormComponent (isEdit = false)
     │
     ▼
Admin fills form → onSubmit() → ApiService.addQuestion() → POST /api/addQuestion
     │
     ▼
Navigate back to /questions (list auto-refreshed)

Admin clicks "Edit" on a question
     │
     ▼
Navigate to /questions/edit/:id
QuestionFormComponent (isEdit = true)
     │
     ▼
Form pre-filled from existing data → onSubmit() → ApiService.updateQuestion() → PUT /api/update/:id
     │
     ▼
Navigate back to /questions

Admin clicks "Delete"
     │
     ▼
confirm() dialog → if OK → ApiService.deleteQuestion() → DELETE /api/delete/:id
     │
     ▼
List re-fetched and updated
```

---

# 🏷️ Key Angular Concepts Used

| Concept | Where Used | What It Does |
|---------|------------|--------------|
| `standalone: true` | All components | No NgModule needed; component is self-contained |
| `inject()` | App, Login, Signup, Forms | Modern dependency injection syntax |
| `signal<T>()` | ApiService | Reactive state; auto-updates UI when changed |
| `[(ngModel)]` | Forms, Filters | Two-way data binding between input and variable |
| `*ngIf` | All templates | Conditionally shows/hides elements |
| `*ngFor` | List, Requests | Loops over arrays to render repeated elements |
| `routerLink` | Navbar, List, Forms | Client-side navigation without page reload |
| `<router-outlet>` | AppComponent | Placeholder where routed pages are rendered |
| `ActivatedRoute` | QuestionForm | Reads URL parameters (e.g. `/edit/:id`) |
| `HttpClient` | ApiService | Makes HTTP GET/POST/PUT/DELETE requests |
| `HttpHeaders` | ApiService | Attaches `Authorization: Bearer <token>` to requests |
| `localStorage` | Login, Signup, App | Persists token/role across page refreshes |
| `implements OnInit` | List, Form | Lifecycle hook — code runs when component first loads |

---

*This file was auto-generated for learning purposes. Last updated: 2026-03-20*
