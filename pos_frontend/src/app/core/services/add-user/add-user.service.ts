import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ✅ Create user (POST /users/create)
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data, { headers: this.getHeaders() });
  }

  // ✅ Update user (PATCH /users/update/:id)
  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update/${id}`, data, { headers: this.getHeaders() });
  }

  // ✅ Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`, { headers: this.getHeaders() });
  }

  // ✅ Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`, { headers: this.getHeaders() });
  }

  // ✅ Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}
