import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private apiUrl = `${environment.apiUrl}/migrations`; // 👈 Base endpoint
  private searchUrl = `${environment.apiUrl}/search-products`;

  constructor(private http: HttpClient) {}

  // ➝ Create Stock Transfer
  createStockTransfer(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  // ➝ Get All Stock Transfers
  getStockTransfers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ➝ Get Single Stock Transfer by ID
  getStockTransferById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ➝ Update Stock Transfer
  updateStockTransfer(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  // ➝ Delete Stock Transfer
  deleteStockTransfer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
    // ✅ ➝ Search Products by Name (Backend Search)
  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.searchUrl}?q=${query}`);
  }
}
