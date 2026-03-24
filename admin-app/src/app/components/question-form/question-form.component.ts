import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem">{{ isEdit ? 'Edit' : 'Add' }} Question</h2>
      <form (ngSubmit)="onSubmit()">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem">Title</label>
          <input class="input-field" type="text" [(ngModel)]="question.title" name="title" required>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem">Description</label>
          <textarea class="input-field" [(ngModel)]="question.description" name="description" rows="4" required></textarea>
        </div>

        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem">Difficulty</label>
          <select class="input-field" [(ngModel)]="question.difficulty" name="difficulty" required>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" [(ngModel)]="question.isImportant" name="isImportant" id="isImportant">
          <label for="isImportant" style="font-weight: 600; cursor: pointer; color: var(--text-main);">Mark as Important Topic</label>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" type="submit" style="flex: 1">{{ isEdit ? 'Update' : 'Save' }} Question</button>
          <a routerLink="/questions" class="btn" style="flex: 1; text-align: center; background: var(--border-color); color: var(--text-main);">Cancel</a>
        </div>
      </form>
    </div>
  `
})
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
        // Fallback fetch if refreshed on edit page
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
