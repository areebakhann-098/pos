import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = `${environment.apiUrl}/categories`; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, categoryData, this.getAuthHeaders());
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, categoryData, this.getAuthHeaders());
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
