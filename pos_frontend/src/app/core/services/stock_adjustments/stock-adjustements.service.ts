import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StockAdjustmentsService {
  private apiUrl = `${environment.apiUrl}/stockadjustment`; // base URL for stock adjustment

  constructor(private http: HttpClient) {}

  // 🔹 Helper Method — Add JWT Token to Headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // 🔑 Retrieve JWT token from localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➝ Create Stock Adjustment
  createStockAdjustment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload, this.getAuthHeaders());
  }

  // ➝ Get All Adjustments
  getAllAdjustments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  // ➝ Get Adjustment by ID
  getAdjustmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  // ➝ Update Adjustment
  updateAdjustment(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, payload, this.getAuthHeaders());
  }

  // ➝ Delete Adjustment
  deleteAdjustment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }

  // ➝ Search Products
  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search-products?q=${query}`, this.getAuthHeaders());
  }
}
