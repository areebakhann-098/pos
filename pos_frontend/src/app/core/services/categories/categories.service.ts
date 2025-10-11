// src/app/services/categories.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = `${environment.apiUrl}/categories`; // ✅ use env base URL

  constructor(private http: HttpClient) {}

  // ➕ Create Category
  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, categoryData);
  }

  // 📋 Get All Categories
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // 🔍 Get Category by ID
  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`);
  }

  // ✏️ Update Category
  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, categoryData);
  }

  // 🗑️ Delete Category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
