import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to attach JWT token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // 🔑 Get token from localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➕ Create Product
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, this.getAuthHeaders());
  }

  // 📋 Get All Products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  // 🔍 Get Product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${id}`, this.getAuthHeaders());
  }

  // ✏️ Update Product
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, this.getAuthHeaders());
  }

  // ❌ Delete Product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
