import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private apiUrl = `${environment.apiUrl}/migrations`; // 👈 Base endpoint
  private searchUrl = `${environment.apiUrl}/search-products`;

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

  // ➝ Create Stock Transfer
  createStockTransfer(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload, this.getAuthHeaders());
  }

  // ➝ Get All Stock Transfers
  getStockTransfers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  // ➝ Get Single Stock Transfer by ID
  getStockTransferById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ➝ Update Stock Transfer
  updateStockTransfer(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload, this.getAuthHeaders());
  }

  // ➝ Delete Stock Transfer
  deleteStockTransfer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ ➝ Search Products by Name (Backend Search)
  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.searchUrl}?q=${query}`, this.getAuthHeaders());
  }
}
