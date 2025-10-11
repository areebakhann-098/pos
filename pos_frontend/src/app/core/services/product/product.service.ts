import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  // ➕ Create Product
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // 📋 Get All Products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // 🔍 Get Product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${id}`);
  }

  // ✏️ Update Product
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  // ❌ Delete Product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
