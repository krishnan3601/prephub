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
