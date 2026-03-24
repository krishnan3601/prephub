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
