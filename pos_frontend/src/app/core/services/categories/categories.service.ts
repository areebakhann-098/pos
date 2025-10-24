import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = `${environment.apiUrl}/categories`; // ✅ use env base URL

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to add JWT token to headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➕ Create Category
  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, categoryData, this.getAuthHeaders());
  }

  // 📋 Get All Categories
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  // 🔍 Get Category by ID
  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  // ✏️ Update Category
  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, categoryData, this.getAuthHeaders());
  }

  // 🗑️ Delete Category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
