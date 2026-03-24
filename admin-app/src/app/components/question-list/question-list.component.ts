import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="api.topicRequests().length > 0" style="background-color: #fef08a; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #facc15;">
      <h4 style="margin-bottom: 0.5rem; color: #854d0e;">🔔 Popular Topic Requests</h4>
      <ul style="margin-left: 1.5rem; color: #713f12; margin-bottom: 0;">
        <li *ngFor="let req of api.topicRequests()">
          <strong>{{ req.topic }}</strong> (Requested by {{ req.count }} students)
        </li>
      </ul>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2>Manage Questions</h2>
      <a routerLink="/questions/add" class="btn" style="background-color: #10b981; text-decoration: none;">+ Add Question</a>
    </div>

    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
      <select class="input-field" style="width: 200px; margin-bottom: 0;" [(ngModel)]="filterDiff">
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      
      <select class="input-field" style="width: 200px; margin-bottom: 0;" [(ngModel)]="sortOrder">
        <option value="asc">A - Z</option>
        <option value="desc">Z - A</option>
      </select>
    </div>
    
    <div class="card" style="padding: 0;">
      <div *ngFor="let q of filteredAndSortedQuestions" style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
        <div style="flex: 1; margin-right: 1rem;">
          <h3 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem;">
            <span *ngIf="q.isImportant" style="color: #f59e0b;" title="Important Topic">★</span>
            {{ q.title }}
            <span class="badge {{ q.difficulty }}">{{ q.difficulty }}</span>
          </h3>
          <p style="color: var(--text-muted); margin-bottom: 0;">{{ q.description }}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
          <a [routerLink]="['/questions/edit', q._id]" class="btn" style="padding: 0.4rem 0.8rem; background: #3b82f6; text-decoration: none;">Edit</a>
          <button (click)="deleteQuestion(q._id)" class="btn" style="padding: 0.4rem 0.8rem; background: #ef4444">Delete</button>
        </div>
      </div>
      <div *ngIf="filteredAndSortedQuestions.length === 0" style="padding: 2rem; text-align: center; color: var(--text-muted)">
        No matching questions found.
      </div>
    </div>
  `
})
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
      if (this.sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
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
