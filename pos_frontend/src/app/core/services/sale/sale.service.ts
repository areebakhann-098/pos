import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = `${environment.apiUrl}/sale`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to attach JWT token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➕ Create Sale
  createSale(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data, this.getAuthHeaders());
  }

  // 📋 Get All Sales
  getAllSales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`, this.getAuthHeaders());
  }

  // 🔍 Get Sale by ID
  getSaleById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  // ✏️ Update Sale
  updateSale(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data, this.getAuthHeaders());
  }

  // ❌ Delete Sale
  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delet/${id}`, this.getAuthHeaders());
  }
}
